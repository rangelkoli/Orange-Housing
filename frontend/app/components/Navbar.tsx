import { Link } from "react-router";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import {
  Building2,
  Home,
  ArrowRightLeft,
  Users,
  Building,
  Store,
  Contact,
  ShoppingCart,
  DollarSign,
  Medal,
  ChevronRight,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Simple logo component for the navbar
const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src='/logo.webp'
      alt='Orange Housing'
      className='h-10 w-auto'
      {...props}
    />
  );
};

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M4 12L20 12'
      className='origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
    />
    <path
      d='M4 12H20'
      className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
    />
    <path
      d='M4 12H20'
      className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
    />
  </svg>
);

// Types
export interface Navbar02NavItem {
  href?: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  submenu?: boolean;
  featured?: boolean;
  items?: Array<{
    href: string;
    label: string;
    description?: string;
    icon?: LucideIcon;
    featured?: boolean;
  }>;
}

export interface Navbar02Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar02NavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Default navigation links (Team Syracuse removed - will be separate)
const defaultNavigationLinks: Navbar02NavItem[] = [
  {
    label: "RENTALS",
    icon: Home,
    submenu: true,
    items: [
      { href: "/rentals", label: "All Rentals", description: "Browse all available rental properties", icon: Home },
      { href: "/short-term", label: "Short-Term", description: "Temporary housing and furnished rentals", icon: Building2 },
      { href: "/sublets", label: "Sublets", description: "Take over an existing lease", icon: ArrowRightLeft },
      { href: "/rooms", label: "Rooms for Rent", description: "Find a room in a shared space", icon: Users },
    ],
  },
  {
    label: "DIRECTORY",
    icon: Building,
    submenu: true,
    items: [
      { href: "/directory/apartment-complexes", label: "Apartment Complexes", description: "Multi-unit residential buildings", icon: Building },
      { href: "/directory/landlords", label: "Landlords", description: "Individual property owners", icon: Contact },
      { href: "/directory/property-managers", label: "Property Managers", description: "Professional management companies", icon: Building2 },
      { href: "/directory/local-businesses", label: "Local Businesses", description: "Services and shops nearby", icon: Store },
      { href: "/directory/nonprofits", label: "NonProfits & Charity", description: "Community organizations", icon: Users },
    ],
  },
  {
    label: "BUY",
    href: "/buy",
    icon: ShoppingCart,
  },
  {
    label: "SELL",
    href: "/sell",
    icon: DollarSign,
  },
];

// Team Syracuse data
const teamSyracuseData = {
  href: "/directory/team-syracuse",
  label: "Team Syracuse",
  description: "A community initiative connecting Syracuse University students, faculty, and staff with trusted local housing providers. Our verified network ensures safe, quality housing options near campus.",
  image: "/team-syracuse-hero.webp",
  stats: [
    { label: "Verified Providers", value: "50+" },
    { label: "Active Listings", value: "200+" },
    { label: "Happy Tenants", value: "1,000+" },
  ],
};

export const Navbar = React.forwardRef<HTMLElement, Navbar02Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      signInText = "",
      signInHref = "#",
      ctaText = "Add/Manage Your Listings",
      ctaHref = "/landlord/login",
      onSignInClick,
      onCtaClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    const toggleMenu = (label: string) => {
      setExpandedMenus(prev => ({
        ...prev,
        [label]: !prev[label]
      }));
    };

    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };
      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md font-mono uppercase supports-[backdrop-filter]:bg-white/60",
          className
        )}
        {...props}
      >
        <div className='w-full px-6 flex h-16 items-center justify-between '>
          {/* Left side: Logo & Mobile Menu */}
          <div className='flex items-center gap-2'>
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className='group h-9 w-9 hover:bg-orange-50 hover:text-orange-600'
                    variant='ghost'
                    size='icon'
                  >
                    <HamburgerIcon className="text-stone-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-72 p-2 max-h-[80vh] overflow-y-auto'>
                  <nav className='flex flex-col gap-1'>
                    {navigationLinks.map((link, index) => (
                      <div key={index} className='w-full'>
                        {link.submenu ? (
                          <>
                            {/* Collapsible dropdown header */}
                            <button
                              onClick={() => toggleMenu(link.label)}
                              className='w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-stone-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer'
                            >
                              <div className="flex items-center gap-2">
                                {link.icon && (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                                    <link.icon className="h-4 w-4" />
                                  </div>
                                )}
                                <span>{link.label}</span>
                              </div>
                              <ChevronDown 
                                className={cn(
                                  "h-4 w-4 text-stone-400 transition-transform duration-200",
                                  expandedMenus[link.label] && "rotate-180"
                                )} 
                              />
                            </button>
                            {/* Collapsible content */}
                            <div className={cn(
                              "overflow-hidden transition-all duration-200 ease-in-out",
                              expandedMenus[link.label] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                              <ul className='space-y-0.5 pl-2 pt-1 pb-2'>
                                {link.items?.map((item, itemIndex) => {
                                  const ItemIcon = item.icon;
                                  return (
                                    <li key={itemIndex}>
                                      <Link
                                        to={item.href || "#"}
                                        onClick={closeMobileMenu}
                                        className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-orange-600 cursor-pointer no-underline group'
                                      >
                                        {ItemIcon && (
                                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                            <ItemIcon className="h-4 w-4" />
                                          </div>
                                        )}
                                        <div className="flex flex-col">
                                          <span>{item.label}</span>
                                          {item.description && (
                                            <span className="text-[10px] text-stone-400 font-normal normal-case">{item.description}</span>
                                          )}
                                        </div>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <Link
                            to={link.href || "#"}
                            onClick={closeMobileMenu}
                            className='flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent hover:text-orange-600 cursor-pointer no-underline'
                          >
                            {link.icon && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                                <link.icon className="h-4 w-4" />
                              </div>
                            )}
                            {link.label}
                          </Link>
                        )}
                        {index < navigationLinks.length - 1 && (
                          <div className='my-1 h-px bg-gradient-to-r from-stone-200 to-transparent' />
                        )}
                      </div>
                    ))}
                    {/* Team Syracuse in mobile */}
                    <div className='my-2 h-px bg-gradient-to-r from-orange-200 to-transparent' />
                    <Link
                      to={teamSyracuseData.href}
                      onClick={closeMobileMenu}
                      className='flex items-center gap-3 rounded-lg px-3 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 text-sm font-semibold text-orange-700 transition-all hover:from-orange-100 hover:to-amber-100 cursor-pointer no-underline'
                    >
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          Team Syracuse
                          <Sparkles className="h-3 w-3 text-amber-500" />
                        </span>
                        <span className="text-[10px] text-orange-500 font-normal normal-case">Verified housing network</span>
                      </div>
                    </Link>
                  </nav>
                </PopoverContent>
              </Popover>
            )}
            {/* Logo */}
            <Link
              to={logoHref}
              className='flex items-center space-x-2 transition-opacity hover:opacity-80 cursor-pointer'
            >
              <div className='flex items-center'>{logo}</div>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          {!isMobile && (
            <div className='flex-1 flex justify-center items-center gap-1 uppercase'>
              <NavigationMenu className='hidden md:flex'>
                <NavigationMenuList className='gap-1'>
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      {link.submenu ? (
                        <>
                          <NavigationMenuTrigger className='h-9 bg-transparent px-4 py-2 text-sm font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 data-[active]:bg-orange-50 data-[state=open]:bg-orange-50 data-[active]:text-orange-600 data-[state=open]:text-orange-600'>
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className='w-[520px] p-4'>
                              {/* Grid of items */}
                              <div className='grid grid-cols-2 gap-2'>
                                {link.items?.map((item, itemIndex) => (
                                  <EnhancedListItem
                                    key={itemIndex}
                                    title={item.label}
                                    description={item.description}
                                    href={item.href}
                                    icon={item.icon}
                                  />
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            to={link.href || "#"}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "h-9 cursor-pointer bg-transparent px-4 py-2 text-sm font-medium text-stone-600 hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 data-[active]:bg-orange-50 data-[state=open]:bg-orange-50 data-[active]:text-orange-600 data-[state=open]:text-orange-600"
                            )}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
                <div className='absolute top-full left-0 flex w-full justify-center'>
                  <NavigationMenuViewport className='origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border border-stone-200 bg-white text-popover-foreground shadow-xl shadow-stone-200/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]' />
                </div>
              </NavigationMenu>

              {/* Team Syracuse Button with Hover Card */}
              <HoverCard openDelay={100} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <Link
                    to={teamSyracuseData.href}
                    className="hidden md:flex items-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer no-underline"
                  >
                    <span>TEAM SYRACUSE</span>
                    <Sparkles className="h-3 w-3 opacity-80" />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent 
                  side="bottom" 
                  align="center" 
                  sideOffset={12}
                  className="w-[400px] p-0 overflow-hidden border-0 shadow-2xl shadow-stone-300/50"
                >
                  <div className="relative">
                    {/* Hero Image */}
                    <div className="relative h-32 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500" />
                      <div className="absolute inset-0 bg-[url('/team-syracuse-hero.webp')] bg-cover bg-center opacity-30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Medal className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              Team Syracuse
                              <Sparkles className="h-4 w-4 text-amber-300" />
                            </h3>
                            <p className="text-xs text-white/80">Verified Housing Network</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 bg-white">
                      <p className="text-sm text-stone-600 leading-relaxed mb-4 normal-case">
                        {teamSyracuseData.description}
                      </p>
                      
                      {/* CTA */}
                      <Link
                        to={teamSyracuseData.href}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all no-underline"
                      >
                        Explore Team Syracuse
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}

          {/* Right side: Auth & CTA */}
          <div className='flex items-center gap-3'>
            {signInText && (
               <Button 
                variant="ghost" 
                asChild
                className="hidden sm:inline-flex text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium"
               >
                 <Link to={signInHref}>{signInText}</Link>
               </Button>
            )}
            
            <Button
              asChild
              className={cn(
                'bg-[#118B50] hover:bg-[#118B50]/90 text-white font-medium shadow-none hover:shadow-sm rounded-md transition-all',
                isMobile ? 'px-2 h-8 text-xs' : 'px-5 h-9 text-sm'
              )}
            >
              <Link to={ctaHref}>{isMobile ? 'Manage Listings' : ctaText}</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }
);
Navbar.displayName = "Navbar";

// Enhanced ListItem component for dropdown menus
const EnhancedListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    description?: string;
    href?: string;
    icon?: LucideIcon;
  }
>(({ className, title, description, href, icon: Icon, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={href || "#"}
        className={cn(
          "group flex flex-col select-none rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50/50 hover:shadow-sm cursor-pointer border border-transparent hover:border-orange-100",
          className
        )}
      >
        {/* Row 1: Icon + Title */}
        <div className="flex items-center gap-2 mb-1">
          {Icon && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
              <Icon className="h-3.5 w-3.5" />
            </div>
          )}
          <div className='text-sm font-semibold text-stone-800 group-hover:text-orange-700 transition-colors'>{title}</div>
        </div>
        {/* Row 2: Description */}
        {description && (
          <div className="text-xs font-normal text-stone-500 normal-case leading-relaxed pl-8">{description}</div>
        )}
      </Link>
    </NavigationMenuLink>
  );
});
EnhancedListItem.displayName = "EnhancedListItem";

// Legacy ListItem for backwards compatibility
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    href?: string;
    icon?: LucideIcon;
  }
>(({ className, title, href, icon: Icon, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        to={href || "#"}
        className={cn(
          "flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 cursor-pointer",
          className
        )}
      >
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-100 text-orange-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className='text-base font-medium leading-none'>{title}</div>
      </Link>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";

export { Logo, HamburgerIcon };
