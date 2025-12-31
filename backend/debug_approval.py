import os
import django
import json
import stripe

import dotenv
dotenv.load_dotenv()

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection
from listings.models import Listing
from django.conf import settings

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

def debug_approve(listing_id):
    print(f"DEBUG: Approving listing {listing_id}")
    try:
        # 1. Get Listing
        with connection.cursor() as cursor:
            cursor.execute("SELECT visible, stripe_payment_method_id, user_id FROM listings WHERE id = %s", [listing_id])
            row = cursor.fetchone()
            if not row:
                print("ERROR: Listing not found")
                return
            visible, pm_id, user_id = row
            print(f"DEBUG: Visible={visible}, PM_ID={pm_id}, User_ID={user_id}")

        # 2. Get User
        with connection.cursor() as cursor:
            cursor.execute("SELECT stripe_customer_id FROM users WHERE user_id = %s", [user_id])
            user_row = cursor.fetchone()
            customer_id = user_row[0] if user_row else None
            print(f"DEBUG: Customer_ID={customer_id}")

        # 3. Get Price
        price_id = os.getenv('STRIPE_PRICE_STANDARD') or os.getenv('STRIPE_SUBSCRIPTION_PRICE_ID')
        print(f"DEBUG: Price_ID={price_id}")

        # 4. Create Subscription
        print("DEBUG: Creating Stripe Subscription...")
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{'price': price_id}],
            default_payment_method=pm_id,
        )
        print(f"SUCCESS: Subscription created: {subscription.id}")

    except Exception as e:
        print(f"EXCEPTION: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_approve(46042)
