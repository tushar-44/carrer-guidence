import { navigationItems } from "@/constants/index";
import { Link } from "react-router-dom";
import { useDrawerStore } from "@/stores/drawerStore";
import { useUserStore } from "@/stores/userStore";
import RainbowButton from '@/components/magicui/rainbow-button';

interface MobileNavProps {
  onNavigationClick: () => void; // Callback to close sidebar
}

export function MobileNav({ onNavigationClick }: MobileNavProps) {
  const { open: openDrawer } = useDrawerStore();
  const { isAuthenticated } = useUserStore();

  const handleNavClick = (item: typeof navigationItems[0]) => {
    // Handle Contact button specifically
    if (item.name === "Contact") {
      console.log('🎯 Opening contact drawer from mobile navigation');
      openDrawer();
      onNavigationClick(); // Close sidebar
      return;
    }

    // For multi-page navigation, close sidebar after navigation
    onNavigationClick();
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.name === "Dashboard" && !isAuthenticated) return false;
    if (item.name === "Login" && isAuthenticated) return false; // Hide login when logged in
    return true;
  });

  return (
    <nav className="flex flex-col gap-2 flex-1 p-4">
      {filteredNavigationItems.map((item) => {
        // Special handling for Contact item
        if (item.name === "Contact") {
          return (
            <RainbowButton
              key={item.name}
              onClick={() => handleNavClick(item)}
              size="lg"
              className="w-full font-heading pt-0.5 text-md mt-4"
              variant="outline"
            >
              {item.name}
            </RainbowButton>
          );
        }

        // Regular navigation items - use Link for routes
        const isRouteLink = item.link.startsWith('/');

        return (
          <div key={item.name}>
            {isRouteLink ? (
              <Link
                to={item.link}
                onClick={() => handleNavClick(item)}
                className="flex items-center gap-3 py-3 text-xl font-heading text-slate-900 rounded-lg transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground focus:outline-none border-b rounded-s-none rounded-e-none text-left cursor-pointer"
              >
                <span>{item.name}</span>
              </Link>
            ) : (
              <button
                onClick={() => handleNavClick(item)}
                className="flex items-center gap-3 py-3 text-xl font-heading text-slate-900 rounded-lg transition-all hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground focus:outline-none border-b rounded-s-none rounded-e-none text-left cursor-pointer w-full"
              >
                <span>{item.name}</span>
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}