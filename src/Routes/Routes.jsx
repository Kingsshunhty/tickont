import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Homepage";
import Login from "../Pages/Login";
import { AuthProvider } from "../Context/AuthContext";
import ForYou from "../Pages/ForYou";
import ProtectedRoute from "./ProtectedRoutes";
// import Profile from "./pages/Profile";
// import Events from "./pages/Events";
// import Sell from "./pages/Sell";
import Account from "../Pages/Account";
import MyEvents from "../Pages/MyEvents";
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/myevents" element={<MyEvents />} />
          q <Route path="/account" element={<Account />} />
          <Route path="/foryou" element={<ForYou />} />
        </Route>

        {/* <Route path="/profile" element={<Profile />} />
      <Route path="/events" element={<Events />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/account" element={<Account />} /> */}
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
