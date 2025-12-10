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
  icon?: LucideIcon;
  submenu?: boolean;
  items?: Array<{
    href: string;
    label: string;
    icon?: LucideIcon;
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

// Default navigation links
const defaultNavigationLinks: Navbar02NavItem[] = [
  {
    label: "PROPERTIES",
    icon: Building2,
    submenu: true,
    items: [
      { href: "/listings", label: "All Properties", icon: Building2 },
      { href: "/rentals", label: "Rentals", icon: Home },
      { href: "/sublets", label: "Sublets", icon: ArrowRightLeft },
      { href: "/rooms", label: "Rooms for Rent", icon: Users },
    ],
  },
  {
    label: "DIRECTORY",
    icon: Building,
    submenu: true,
    items: [
      { href: "/directory/complex", label: "Apartment Complex", icon: Building },
      { href: "/directory/business", label: "Business Directory", icon: Store },
      {
        href: "/directory/landlords",
        label: "Landlords and Property Managers",
        icon: Contact,
      },
    ],
  },
  {
    label: "TEAM SYRACUSE",
    href: "/team-syracuse",
    icon: Medal,
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
    const containerRef = useRef<HTMLElement>(null);

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className='group h-9 w-9 hover:bg-orange-50 hover:text-orange-600'
                    variant='ghost'
                    size='icon'
                  >
                    <HamburgerIcon className="text-stone-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='w-64 p-1'>
                  <NavigationMenu className='max-w-none'>
                    <NavigationMenuList className='flex-col items-start gap-0'>
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className='w-full '>
                          {link.submenu ? (
                            <>
                              <div className='text-stone-500 px-2 py-1.5 text-xs font-medium uppercase tracking-wider'>
                                {link.label}
                              </div>
                              <ul>
                                    {link.items?.map((item, itemIndex) => {
                                      const ItemIcon = item.icon;
                                      return (
                                      <li key={itemIndex}>
                                        <Link
                                          to={item.href || "#"}
                                          className='flex flex-row w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 cursor-pointer no-underline'
                                        >
                                          {ItemIcon && <ItemIcon className="h-4 w-4 flex-shrink-0" />}
                                          {item.label}
                                        </Link>
                                      </li>
                                    )})}
                                  </ul>
                            </>
                          ) : (
                            <Link
                              to={link.href || "#"}
                              className='flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600 cursor-pointer no-underline'
                            >
                              {link.label}
                            </Link>
                          )}
                          {/* Add separator between different types of items */}
                          {index < navigationLinks.length - 1 &&
                            ((!link.submenu &&
                              navigationLinks[index + 1].submenu) ||
                              (link.submenu &&
                                !navigationLinks[index + 1].submenu)) && (
                                <div
                                  role='separator'
                                  aria-orientation='horizontal'
                                  className='bg-stone-200 -mx-1 my-1 h-px w-full'
                                />
                              )}
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
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
            <div className='flex-1 flex justify-center uppercase'>
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
                            <div className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                              {link.items?.map((item, itemIndex) => (
                                <ListItem
                                  key={itemIndex}
                                  title={item.label}
                                  href={item.href}
                                  icon={item.icon}
                                />
                              ))}
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
                    <NavigationMenuViewport className='origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-stone-200 bg-white text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]' />
                </div>
              </NavigationMenu>
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
              className='bg-[#118B50] hover:bg-[#118B50]/90 text-white font-medium shadow-none hover:shadow-sm px-5 h-9 rounded-md transition-all'
            >
              <Link to={ctaHref}>{ctaText}</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }
);
Navbar.displayName = "Navbar";

// ListItem component for navigation menu items
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
