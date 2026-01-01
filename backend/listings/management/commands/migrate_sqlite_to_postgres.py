"""
Django management command to migrate data from SQLite to PostgreSQL.
This reads data from a local SQLite database and inserts it into the configured PostgreSQL database.
"""

import sqlite3
from django.core.management.base import BaseCommand
from django.db import connection
from pathlib import Path


class Command(BaseCommand):
    help = 'Migrate data from SQLite database to PostgreSQL'

    def add_arguments(self, parser):
        parser.add_argument(
            '--sqlite-db',
            type=str,
            default='local.db',
            help='Path to SQLite database file (default: local.db)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually inserting data'
        )

    def handle(self, *args, **options):
        sqlite_path = options['sqlite_db']
        dry_run = options['dry_run']

        # Check if SQLite file exists
        if not Path(sqlite_path).exists():
            self.stderr.write(self.style.ERROR(f'SQLite database not found: {sqlite_path}'))
            return

        self.stdout.write(f'Connecting to SQLite database: {sqlite_path}')
        sqlite_conn = sqlite3.connect(sqlite_path)
        sqlite_conn.row_factory = sqlite3.Row
        sqlite_cursor = sqlite_conn.cursor()

        # Get list of tables from SQLite
        sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [row['name'] for row in sqlite_cursor.fetchall()]
        
        self.stdout.write(f'Found {len(tables)} tables: {", ".join(tables)}')

        # Get PostgreSQL table info
        pg_tables = self.get_pg_tables()
        self.stdout.write(f'PostgreSQL tables: {", ".join(sorted(pg_tables.keys()))}')

        # Define the order of tables to respect foreign key constraints
        table_order = [
            # Django internal tables
            'django_content_type',
            'auth_permission',
            'auth_group',
            'auth_user',
            'django_migrations',
            'django_session',
            'django_admin_log',
            'auth_group_permissions',
            'auth_user_groups',
            'auth_user_user_permissions',
            # Lookup tables first
            'lookup_building_types',
            'lookup_listing_types',
            'lookup_locations',
            'lookup_utilities',
            # Users table (referenced by listings)
            'users',
            # Main tables
            'listings',
            'photos',
            'pending_listings',
            'listings_listing_utilities',
            'ads',
            'alerts',
            'directory',
        ]

        # Filter to only tables that exist in both SQLite and PostgreSQL
        tables_to_migrate = [t for t in table_order if t in tables and t in pg_tables]
        
        # Add any tables not in our order
        for t in tables:
            if t not in tables_to_migrate and t in pg_tables:
                tables_to_migrate.append(t)

        self.stdout.write(f'\nMigrating tables in order: {", ".join(tables_to_migrate)}')

        if dry_run:
            self.stdout.write(self.style.WARNING('\n=== DRY RUN MODE ===\n'))

        with connection.cursor() as pg_cursor:
            for table_name in tables_to_migrate:
                self.migrate_table(sqlite_cursor, pg_cursor, table_name, pg_tables[table_name], dry_run)

        sqlite_conn.close()
        self.stdout.write(self.style.SUCCESS('\nMigration complete!'))

    def get_pg_tables(self):
        """Get PostgreSQL table and column information"""
        tables = {}
        with connection.cursor() as cursor:
            # Get all tables
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            table_names = [row[0] for row in cursor.fetchall()]
            
            for table_name in table_names:
                # Get columns for each table
                cursor.execute("""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = %s
                    ORDER BY ordinal_position
                """, [table_name])
                columns = {}
                for row in cursor.fetchall():
                    columns[row[0]] = {
                        'type': row[1],
                        'nullable': row[2] == 'YES'
                    }
                tables[table_name] = columns
        
        return tables

    def migrate_table(self, sqlite_cursor, pg_cursor, table_name, pg_columns, dry_run):
        """Migrate data from a single table"""
        try:
            # Get column names from SQLite
            sqlite_cursor.execute(f'PRAGMA table_info("{table_name}")')
            sqlite_columns_info = sqlite_cursor.fetchall()
            sqlite_columns = [col['name'] for col in sqlite_columns_info]
            
            if not sqlite_columns:
                self.stdout.write(f'  {table_name}: No columns found, skipping')
                return

            # Find common columns (exist in both SQLite and PostgreSQL)
            common_columns = [col for col in sqlite_columns if col in pg_columns]
            
            if not common_columns:
                self.stdout.write(f'  {table_name}: No common columns, skipping')
                return
            
            # Columns that exist in SQLite but not PostgreSQL
            missing_in_pg = [col for col in sqlite_columns if col not in pg_columns]
            if missing_in_pg:
                self.stdout.write(f'  {table_name}: Skipping columns not in PostgreSQL: {", ".join(missing_in_pg)}')

            # Get all data from SQLite
            sqlite_cursor.execute(f'SELECT * FROM "{table_name}"')
            rows = sqlite_cursor.fetchall()
            
            if not rows:
                self.stdout.write(f'  {table_name}: No data to migrate')
                return

            self.stdout.write(f'  {table_name}: Found {len(rows)} rows ({len(common_columns)} columns)')

            if dry_run:
                self.stdout.write(f'    Would insert {len(rows)} rows')
                return

            # Build the INSERT statement with only common columns
            columns_str = ', '.join([f'"{col}"' for col in common_columns])
            placeholders = ', '.join(['%s'] * len(common_columns))
            
            insert_sql = f'INSERT INTO "{table_name}" ({columns_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'
            
            inserted = 0
            errors = 0
            
            for row in rows:
                try:
                    # Get values for common columns only
                    values = []
                    for col in common_columns:
                        val = row[col]
                        pg_type = pg_columns[col]['type']
                        
                        # Convert SQLite integers to booleans for boolean columns
                        if pg_type == 'boolean' and isinstance(val, int):
                            val = bool(val)
                        
                        # Handle invalid date/time values from SQLite
                        if pg_type in ('timestamp without time zone', 'timestamp with time zone', 'date'):
                            if isinstance(val, str):
                                # Convert invalid dates to NULL
                                if val.startswith('0000-00-00') or val == '' or val == '0':
                                    val = None
                        
                        values.append(val)
                    
                    pg_cursor.execute(insert_sql, values)
                    inserted += 1
                except Exception as e:
                    errors += 1
                    if errors <= 5:  # Only show first 5 errors
                        self.stderr.write(f'    Error inserting row: {e}')
            
            # Update sequence for auto-increment columns
            self.update_sequence(pg_cursor, table_name, common_columns)
            
            self.stdout.write(f'    Inserted {inserted} rows ({errors} errors)')
            
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'  Error migrating {table_name}: {e}'))

    def update_sequence(self, pg_cursor, table_name, columns):
        """Update the sequence for auto-increment columns"""
        try:
            # Common primary key column names
            pk_candidates = ['id', 'user_id', 'photo_id']
            pk_col = None
            for pk in pk_candidates:
                if pk in columns:
                    pk_col = pk
                    break
            
            if pk_col:
                pg_cursor.execute(f"""
                    SELECT setval(pg_get_serial_sequence('"{table_name}"', '{pk_col}'), 
                           COALESCE((SELECT MAX("{pk_col}") FROM "{table_name}"), 1), true)
                """)
        except Exception:
            pass  # Sequence update failed, not critical
