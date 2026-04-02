import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft, LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/Authcontext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Features", href: "/#insights", type: "hash" },
    { label: "Domains", href: "/#domains", type: "hash" },
    { label: "Pricing", href: "/pricing", type: "route" },
    { label: "About", href: "/about", type: "route" },
  ];

  const scrollToSection = (sectionId: string, type: string = "hash") => {
    // If it's a route, navigate to it using React Router
    if (type === "route") {
      navigate(sectionId);
      return;
    }

    // For hash links, extract the clean ID
    const cleanId = sectionId.replace("#", "");
    
    // Always try to scroll to the section first
    const section = document.getElementById(cleanId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If section doesn't exist, navigate to home page first, then scroll
      navigate("/").then(() => {
        setTimeout(() => {
          const newSection = document.getElementById(cleanId);
          if (newSection) {
            newSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      });
    }
  };

  useEffect(() => {
    // Handle hash scrolling when navigating to home page with hash
    if (location.pathname === "/" && location.hash) {
      const sectionId = location.hash.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.pathname]);

  return (
    <nav className="border-b backdrop-blur-md bg-background/80 py-4 px-6 fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 transition-all duration-300"
            aria-label="Go to home"
          >
            <ArrowLeft className="h-5 w-5 text-primary group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
          <Compass className="h-7 w-7 text-primary animate-pulse-slow" />
          <span className="font-bold text-xl gradient-text">StartupSync</span>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 pt-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href, item.type);
                    }}
                    className="text-foreground hover:text-primary py-2 transition-colors text-lg font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              {!loading && (
                <div className="mt-8 pt-8 border-t border-muted">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl">
                        {user.picture && (
                          <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full ring-2 ring-primary/20" />
                        )}
                        <div className="text-sm">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full btn-glow" 
                        variant="outline"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full btn-glow bg-gradient-to-r from-primary to-secondary" 
                      onClick={signInWithGoogle}
                    >
                      <User className="h-4 w-4 mr-2" /> Login with Google
                    </Button>
                  )}
                </div>
              )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href, item.type);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all duration-300">
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="h-full w-full rounded-full object-cover" 
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button className="btn-glow bg-gradient-to-r from-primary to-secondary" onClick={signInWithGoogle}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;