import { IoSearchOutline, IoHeartSharp, IoTicket } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const navigate = useNavigate(); // Initialize navigation

  const tabs = [
    {
      id: "discover",
      label: "Discover",
      icon: <IoSearchOutline size={22} />,
      path: "/home",
    },
    {
      id: "foryou",
      label: "For You",
      icon: <IoHeartSharp size={22} />,
      path: "/foryou",
    },
    {
      id: "myevents",
      label: "My Events",
      icon: <IoTicket size={22} />,
      path: "/myevents",
    },
    {
      id: "sell",
      label: "Sell",
      icon: <FaMoneyBillWave size={22} />,
      path: "/sell",
    },
    {
      id: "account",
      label: "My Account",
      icon: <FaCircleUser size={22} />,
      path: "/account",
    },
  ];

  return (
    <div className="fixed z-40 bottom-0 left-0 w-full bg-white text-white py-7 border-t border-gray-200 flex justify-around">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            navigate(tab.path); // Navigate to the assigned path
          }}
          className={`flex flex-col items-center -translate-y-4 text-sm transition-all ${
            activeTab === tab.id ? "text-customBlue" : "text-customGray"
          }`}
        >
          {tab.icon}
          <span className="mt-1 font-medium text-xxs">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
