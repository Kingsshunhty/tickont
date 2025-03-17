import React, { useState, useEffect } from "react";
import Navbar from "../Components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import { fetchTickets, deleteTicket } from "../redux/ticketSlice";
import { doc, getDoc } from "firebase/firestore";
import { LuDot } from "react-icons/lu";
import { IoTicket } from "react-icons/io5";
import CountryFlag from "react-country-flag";
import { useAuth } from "../Context/AuthContext";
import TicketModal from "../Components/TicketModal";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../firebase.config";
const MyEvents = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  // Use Redux to manage tickets state instead of local state
  const tickets = useSelector((state) => state.tickets.tickets);
  // We'll treat all tickets as upcoming
  const upcomingTickets = tickets;
  const pastTickets = [];

  // Manage active tab locally
  const [activeTab, setActiveTab] = useState("upcoming");

  // Country state (for header flag)
  const [selectedCountry, setSelectedCountry] = useState({
    code: "US",
    name: "United States",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch tickets only once using Redux
  useEffect(() => {
    // If there are no tickets yet, fetch them
    if (!tickets || tickets.length === 0) {
      dispatch(fetchTickets());
    }
  }, [dispatch, tickets]);

  // Fetch user's country from Firestore if user exists
  useEffect(() => {
    if (!user) return;

    const fetchUserCountry = async () => {
      try {
        // Assuming user country is stored in Firestore under "users/{uid}"
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.country) {
            console.log("User’s country:", userData.country);
            setSelectedCountry(userData.country);
          }
        }
      } catch (error) {
        console.error("Error fetching user country:", error);
      }
    };

    fetchUserCountry();
  }, [user]);

  // Handler for opening a ticket view.
  // When a user clicks, ask if they want to delete the ticket.
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  return (
    <div className="min-h-screen bg-white text-white">
      {/* Header with flag */}
      <header className="px-4 py-6 flex items-center bg-customBlack justify-between relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <h1 className="text-center text-sm">My Events</h1>
          <div className="w-6 h-6 flex items-center p-0.5 justify-center rounded-full overflow-hidden border border-white">
            <CountryFlag
              countryCode={selectedCountry.code}
              svg
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
        <p className="ml-auto text-sm cursor-pointer">Help</p>
      </header>

      {/* Tab Bar */}
      <div className="flex border-b shadow-md bg-customBlue">
        <button
          className={`flex-1 py-2.5 text-xs text-center ${
            activeTab === "upcoming"
              ? "text-white border-b-4 border-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          UPCOMING ({upcomingTickets.length})
        </button>
        <button
          className={`flex-1 py-2 text-xs text-center ${
            activeTab === "past"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-300"
          }`}
          onClick={() => setActiveTab("past")}
        >
          PAST ({pastTickets.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-2">
        {activeTab === "upcoming" &&
          upcomingTickets.map((ticket) => (
            <div key={ticket.id} className="mb-4 text-black overflow-hidden">
              {/* Image + Overlay; clicking calls openModal */}
              <div
                className="relative h-56 md:h-48 cursor-pointer"
                onClick={() => openModal(ticket)}
              >
                <img
                  src={ticket.coverImage}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full text-white p-3">
                  <h2 className="text-xl font-normal mb-0.5">{ticket.title}</h2>
                  <p className="flex items-center text-xs mb-1">
                    {ticket.dateTime}
                    <LuDot className="mx-1 text-base" />
                    {ticket.location}
                  </p>
                  <p className="flex items-center text-xs font-light">
                    <IoTicket className="mr-1 text-sm" />
                    {ticket.quantity} tickets
                  </p>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "upcoming" && upcomingTickets.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No upcoming events.</p>
        )}
        {activeTab === "past" && pastTickets.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No past events.</p>
        )}
      </div>

      {/* Render the TicketModal */}
      <TicketModal
        isOpen={showModal}
        onClose={closeModal}
        ticket={selectedTicket}
      />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default MyEvents;
