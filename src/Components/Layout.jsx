import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; // You forgot this import
import BottomNav from "./BottomBar";
import SplashScreen from "./SplashScreen";

const Layout = ({ children }) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // When app loads, show splash for 4 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []); // Run only once

  // Routes where BottomNav should not appear
  const hideBottomNavOn = ["/", "/splash", "/ticketmaster"];
  const addPadding = !hideBottomNavOn.includes(location.pathname);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Show SplashScreen if active */}
      {showSplash ? (
        <div className="absolute inset-0 z-50">
          <SplashScreen />
        </div>
      ) : (
        <>
          {/* Main Content */}
          <main className={`flex-grow ${addPadding ? "pb-16" : ""}`}>
            {children}
          </main>

          {/* Bottom Navigation */}
          {!hideBottomNavOn.includes(location.pathname) && <BottomNav />}
        </>
      )}
    </div>
  );
};

export default Layout;
