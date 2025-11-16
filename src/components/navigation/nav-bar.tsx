import { useState } from "react";
import { navigationItems } from "@/constants/index";
import { Tab } from "./tab";
import { Cursor } from "./cursor";
import { Sidebar } from "./sidebar/sidebar";
import { useNavigationStore } from "@/stores/navigationStore";
import { useUserStore } from "@/stores/userStore";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  const { isAuthenticated, currentUser } = useUserStore();

  // Use actual authentication status
  const isLoggedIn = isAuthenticated;

  // Role-based navigation filtering
  const getFilteredNavigationItems = () => {
    let items = navigationItems.filter(item => {
      if (item.name === "Dashboard" && !isLoggedIn) return false;
      if (item.name === "Admin Panel" && currentUser?.type !== 'mentor') return false; // Only mentors can access admin panel
      if (item.name === "Login" && isLoggedIn) return false; // Hide login when logged in
      return true;
    });

    // Role-specific filtering based on new user types
    if (currentUser?.type === 'mentor') {
      items = items.filter(item => item.name !== 'Jobs'); // Mentors don't need jobs
    } else if (currentUser?.type === 'company') {
      // Companies might want to emphasize jobs and mentors
      items = items.filter(item => item.name !== 'Assessment'); // Companies don't need assessments
    } else if (currentUser?.type === 'graduates') {
      // Graduates get full access to all features
    }

    // Remove Login from navigation items since we have auth buttons
    items = items.filter(item => item.name !== 'Login');

    return items;
  };

  const filteredNavigationItems = getFilteredNavigationItems();

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
          {filteredNavigationItems.map((item) => (
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
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
              </li>
              <li className="ml-2">
                <Link to="/register">
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
                onClick={() => {}}
              >
                Sign Out
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
