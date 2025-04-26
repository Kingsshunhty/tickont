import { useLocation } from "react-router-dom";
import BottomNav from "./BottomBar";

const Layout = ({ children }) => {
  const location = useLocation();

  // Define routes where BottomNav should NOT appear
  const hideBottomNavOn = ["/", "/splash", ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow pb-16">{children}</main>

      {/* Show BottomNav unless the route is in `hideBottomNavOn` */}
      {!hideBottomNavOn.includes(location.pathname) && <BottomNav />}
    </div>
  );
};

export default Layout;
