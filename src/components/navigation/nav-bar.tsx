import { useState } from "react";
import { toast } from "sonner";
import { navigationItems, roleBasedNavigation } from "@/constants/index";
import { Tab } from "./tab";
import { Cursor } from "./cursor";
import { Sidebar } from "./sidebar/sidebar";
import { useNavigationStore } from "@/stores/navigationStore";
import { useUserStore } from "@/stores/userStore";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { Position } from "./types";

export function NavBar() {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [showRoleModal, setShowRoleModal] = useState(false);

  // Get active navigation item using optimized selector
  const activeNavigationItem = useNavigationStore(state => state.getActiveNavigationItem());
  const { isAuthenticated, currentUser, logout } = useUserStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Use actual authentication status
  const isLoggedIn = isAuthenticated;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out. Please try again.');
        setIsSigningOut(false);
        return;
      }
      
      // Clear user store
      logout();
      
      // Navigate to home
      navigate('/');
      
      // Show success message
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Unexpected error signing out:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsSigningOut(false);
    }
  };

  // Get role-based navigation items
  const getRoleBasedNavigationItems = () => {
    if (!isLoggedIn || !currentUser?.type) {
      // Show default navigation for non-logged in users (exclude Dashboard, Admin Panel, Login)
      return navigationItems.filter(item =>
        item.name !== 'Dashboard' && 
        item.name !== 'Admin Panel' &&
        item.name !== 'Login'
      );
    }

    // Return role-specific navigation for logged-in users
    const roleNav = roleBasedNavigation[currentUser.type as keyof typeof roleBasedNavigation];
    if (roleNav) {
      // Convert role nav to NavigationItem format
      return roleNav.map(item => ({
        name: item.name,
        link: item.link,
        mobileLink: item.link
      }));
    }
    
    // Fallback: show navigation without Login
    return navigationItems.filter(item => item.name !== 'Login');
  };

  const navigationItemsToShow = getRoleBasedNavigationItems();

  return (
    <>
      {/* Desktop Navigation - Mindler-inspired clean design */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-brand-cream border border-brand-slate/20 rounded-full px-3 py-2 shadow-sm">
          <ul
            onMouseLeave={() => {
              setPosition((pv) => ({
                ...pv,
                opacity: 0,
              }));
            }}
            className="flex items-center justify-center gap-1 relative"
          >
          {navigationItemsToShow.map((item) => (
            <Tab
              key={item.name}
              setPosition={setPosition}
              href={item.link}
              isActive={activeNavigationItem === item.name}
            >
              {item.name}
            </Tab>
          ))}

          {/* Auth buttons */}
          {!isLoggedIn ? (
            <>
              <li className="ml-4">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
              </li>
              <li className="ml-2">
                <Link to="/auth/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </li>
            </>
          ) : (
            <li className="ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </li>
          )}

          <Cursor position={position} />
          </ul>
        </div>
      </nav>

      <Sidebar />

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
    </>
  );
}
