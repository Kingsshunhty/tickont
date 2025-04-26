import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "./BottomBar";
import SplashScreen from "./SplashScreen";

const Layout = ({ children }) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When user returns to the app
        setShowSplash(true);

        setTimeout(() => {
          setShowSplash(false);
        }, 4000); // splash shows for 4 seconds
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Show splash on initial load too
    const initialTimer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(initialTimer);
    };
  }, []);

  const hideBottomNavOn = ["/", "/splash", "/ticketmaster"];
  const addPadding = !hideBottomNavOn.includes(location.pathname);

  return (
    <div className="relative min-h-screen flex flex-col">
      {showSplash ? (
        <div className="absolute inset-0 z-50">
          <SplashScreen />
        </div>
      ) : (
        <>
          <main className={`flex-grow ${addPadding ? "pb-16" : ""}`}>
            {children}
          </main>
          {!hideBottomNavOn.includes(location.pathname) && <BottomNav />}
        </>
      )}
    </div>
  );
};

export default Layout;
