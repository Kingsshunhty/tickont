import BottomNav from "./BottomBar";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow pb-16">{children}</main> {/* Prevents content from overlapping BottomNav */}

      {/* Persistent Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
