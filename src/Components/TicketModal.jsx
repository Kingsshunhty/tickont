import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { gsap } from "gsap";
import { MdInfo, MdOutlineClose } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { IoTicket } from "react-icons/io5";
import { BsUpcScan } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { deleteTicket } from "../redux/ticketSlice";
import MapComponent from "./Map";
// 1) Firestore addDoc import
import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
const TicketModal = ({ isOpen, onClose, ticket }) => {
  if (!ticket) return null;

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isTransferDetailOpen, setIsTransferDetailOpen] = useState(false);

  // The selected seats from the seat selection step
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Refs for animating the modals
  const mainModalRef = useRef(null);
  const transferModalRef = useRef(null);
  const transferDetailModalRef = useRef(null);

  const quantityNumber = Number(ticket.quantity) || 1;
const dispatch = useDispatch();
  // ~~~~~ MAIN TICKET MODAL ANIMATIONS ~~~~~
  const afterOpenMainModal = () => {
    gsap.fromTo(
      mainModalRef.current,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };
  const beforeCloseMainModal = () => {
    return new Promise((resolve) => {
      gsap.to(mainModalRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.2,
        onComplete: resolve,
      });
    });
  };

  // ~~~~~ TRANSFER SEAT SELECTION MODAL ANIMATIONS ~~~~~
  const afterOpenTransferModal = () => {
    gsap.fromTo(
      transferModalRef.current,
      { y: "100%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };
  const beforeCloseTransferModal = () => {
    return new Promise((resolve) => {
      gsap.to(transferModalRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.2,
        onComplete: resolve,
      });
    });
  };
  const handleDeleteTicket = async () => {
    if (window.confirm("Do you want to delete this ticket?")) {
      try {
        await dispatch(deleteTicket(ticket.id)).unwrap();
        toast.success("Ticket deleted successfully.");
        onClose();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete ticket.");
      }
    }
  };
  // ~~~~~ FINAL TRANSFER DETAIL MODAL ANIMATIONS ~~~~~
  const afterOpenTransferDetailModal = () => {
    gsap.fromTo(
      transferDetailModalRef.current,
      { y: "100%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };
  const beforeCloseTransferDetailModal = () => {
    return new Promise((resolve) => {
      gsap.to(transferDetailModalRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.2,
        onComplete: resolve,
      });
    });
  };

  // React Modal Styles
  const mainModalStyles = {
    content: {
      inset: 0,
      padding: 0,
      border: "none",
      borderRadius: 0,
      background: "transparent",
      overflow: "hidden",
    },
    overlay: {
      backgroundColor: "transparent",
      zIndex: 9999,
    },
  };

  const transferModalStyles = {
    content: {
      margin: 0,
      padding: 0,
      border: "none",
      borderRadius: "0.5rem 0.5rem 0 0",
      bottom: 0,
      left: 0,
      right: 0,
      top: "auto",
      background: "white",
      overflow: "hidden",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 10000,
    },
  };

  return (
    <>
      {/* MAIN TICKET MODAL */}
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenMainModal}
        onRequestClose={async () => {
          await beforeCloseMainModal();
          onClose();
        }}
        style={mainModalStyles}
        closeTimeoutMS={300}
        ariaHideApp={false}
      >
        <div
          className="fixed inset-0 bg-white flex flex-col"
          ref={mainModalRef}
        >
          {/* Header */}
          <div className="flex items-center bg-customBlack justify-between px-4 py-6 border-b border-gray-200">
            <MdOutlineClose
              className="text-2xl text-white cursor-pointer"
              onClick={async () => {
                await beforeCloseMainModal();
                onClose();
              }}
            />
            <h2 className="text-base font-semibold text-white">My Tickets</h2>
            <p className="text-sm text-white cursor-pointer">Help</p>
          </div>

          {/* Main content: horizontally scrollable tickets */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pb-32">
            <div
              className="flex space-x-4 overflow-x-auto scrollbar-hide"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {Array.from({ length: quantityNumber }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-80 rounded-md shadow-md relative bg-white border border-gray-200"
                >
                  {/* Top Bar */}
                  <div className="bg-customBlue text-white text-xs p-2 flex justify-center rounded-t-md items-center">
                    <p className="uppercase text-base font-light">
                      Verified Fan Onsale
                    </p>
                  </div>

                  {/* Middle Bar */}
                  <div className="bg-blue-600 text-white px-6 text-base py-4 flex justify-between">
                    <div className="flex flex-col">
                      <span className="uppercase text-xs font-light">SEC</span>
                      <span className="uppercase font-semibold">
                        {ticket.section || "GA"}
                      </span>
                    </div>
                    <span className="uppercase font-light">
                      {ticket.admissionType || "General Admission"}
                    </span>
                  </div>

                  {/* Ticket Image */}
                  <div className="relative h-52 w-full bg-gray-200">
                    <img
                      src={ticket.coverImage}
                      alt={ticket.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-white w-full px-4">
                      <h2 className="text-lg font-normal">{ticket.title}</h2>
                      <p className="flex items-center justify-center text-xs font-light">
                        {ticket.dateTime}
                        <LuDot className="mx-1 text-xl" />
                        {ticket.location}
                      </p>
                    </div>
                  </div>

                  {/* Lower Section */}
                  <div className="py-6 px-4 pb-12 border-b border-customBlue text-gray-800">
                    <p className="text-sm text-center font-bold mb-2">
                      {ticket.gate || "GATE 1"}
                    </p>
                    {/* View Ticket Button */}
                    <button
                      className="bg-customBlue w-full text-white py-2 text-sm mt-4 font-medium mb-2 flex items-center justify-center"
                      onClick={handleDeleteTicket}
                    >
                      <BsUpcScan className="mr-2 text-base" />
                      View Ticket
                    </button>
                    {/* Ticket Details Link */}
                    <p className="text-customBlue text-xs text-center font-bold mt-5 cursor-pointer">
                      Ticket Details
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: quantityNumber }).map((_, index) => (
                <span
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300"
                ></span>
              ))}
            </div>

            {/* Transfer & Sell Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="bg-customBlue text-white w-44 py-2 h-10 rounded-md text-sm items-center flex justify-center  font-medium"
                onClick={() => setIsTransferOpen(true)}
              >
                Transfer
              </button>
              <button className="bg-customBlue text-white w-44 py-3 h-10 rounded-md items-center flex justify-center text-sm font-medium">
                Sell
              </button>
            </div>
            <div className="mt-7">

            <MapComponent/>
            </div>
          </div>
        </div>
      </Modal>

      {/* TRANSFER MODAL (Seat Selection) */}
      <Modal
        isOpen={isTransferOpen}
        onAfterOpen={afterOpenTransferModal}
        onRequestClose={async () => {
          await beforeCloseTransferModal();
          setIsTransferOpen(false);
        }}
        style={transferModalStyles}
        ariaHideApp={false}
      >
        <div
          className="rounded-t-lg shadow-lg py-2 px-4 relative"
          ref={transferModalRef}
        >
          {/* Transfer Modal Header */}
          <div className="flex items-center justify-center border-b pb-2 relative">
            <h2 className="text-xs font-medium uppercase">
              Select Tickets to Transfer
            </h2>
          </div>

          {/* Info Message */}
          <div className="flex items-center border-b py-1 mt-1 text-sm text-gray-900">
            <MdInfo className="mr-2 text-5xl text-gray-400" />
            <span>
              Only transfer tickets to people you know and trust to ensure
              everyone stays safe.
            </span>
          </div>

          {/* Seat Selection */}
          <TransferSeatSelector
            quantityNumber={quantityNumber}
            ticket={ticket}
            onDone={(selected) => {
              setSelectedSeats(selected);
              beforeCloseTransferModal().then(() => {
                setIsTransferOpen(false);
                setIsTransferDetailOpen(true);
              });
            }}
          />
        </div>
      </Modal>

      {/* FINAL TRANSFER DETAILS MODAL */}
      <TransferDetailModal
        isOpen={isTransferDetailOpen}
        onClose={() => setIsTransferDetailOpen(false)}
        selectedSeats={selectedSeats}
        ticket={ticket}
      />
    </>
  );
};

/* ~~~~~~~~~~~~~~ SEAT SELECTION COMPONENT ~~~~~~~~~~~~~~ */
function TransferSeatSelector({ quantityNumber, ticket, onDone }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatIndex) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatIndex);
      if (isSelected) {
        return prev.filter((idx) => idx !== seatIndex);
      } else {
        return [...prev, seatIndex];
      }
    });
  };

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-base text-black font-medium">
            Sec {ticket.section || "GA"}, Row {"-"}
          </p>
          {/* Show number selected & total */}
          <div className="text-black flex items-center font-medium">
            <IoTicket className="mr-1 text-gray-500 text-sm" />
            {quantityNumber} ticket(s)
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          {Array.from({ length: quantityNumber }).map((_, i) => {
            const isSelected = selectedSeats.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleSeat(i)}
                className="w-16 h-20 shadow-lg bg-white flex flex-col justify-start items-center rounded-xl border border-gray-300 relative"
              >
                {/* Blue Top Portion */}
                <div className="bg-customBlue w-full text-white text-xs flex justify-center items-center py-2 rounded-t-md">
                  SEAT
                </div>

                {/* Selectable Circle */}
                <span
                  className={`mt-4 w-5 h-5 border border-gray-400 rounded-full ${
                    isSelected ? "bg-blue-600" : "bg-white"
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t mt-4 translate-y-4 border-gray-200"></div>

      {/* Bottom Row => (# selected) & Transfer To */}
      <div className="mt-6 mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {selectedSeats.length} Selected
        </p>
        <button
          className="flex items-center uppercase text-blue-600 font-medium text-xs"
          onClick={() => onDone(selectedSeats)}
        >
          Transfer To
          <GoChevronRight className="ml-1" />
        </button>
      </div>
    
    </>
  );
}

/* ~~~~~~~~~~~~~~ FINAL TRANSFER DETAIL MODAL ~~~~~~~~~~~~~~ */
function TransferDetailModal({ isOpen, onClose, selectedSeats, ticket }) {
  const transferDetailModalRef = useRef(null);

  // 2) Local states to capture user input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [note, setNote] = useState("");

  const afterOpen = () => {
    gsap.fromTo(
      transferDetailModalRef.current,
      { y: "100%", opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };
  const beforeClose = () => {
    return new Promise((resolve) => {
      gsap.to(transferDetailModalRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.2,
        onComplete: resolve,
      });
    });
  };

  // The number of seats the user selected
  const seatCount = selectedSeats.length;

  // 3) Handle the final transfer => Save to Firestore
  const handleTransfer = async () => {
    try {
      // Compose the data
      const transferData = {
        firstName,
        lastName,
        emailOrMobile,
        note,
        seats: selectedSeats,
        // Basic ticket info
        ticketId: ticket.id,
        eventTitle: ticket.title,
        eventDateTime: ticket.dateTime,
        eventLocation: ticket.location,
        eventCoverImage: ticket.coverImage,
        section: ticket.section || "GA",
        row: ticket.row || "-",
        // You can add more if needed
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      await addDoc(collection(db, "transfers"), transferData);

      // Then close the modal
      await beforeClose();
      onClose();

      // Optional: Clear fields if you want
      setFirstName("");
      setLastName("");
      setEmailOrMobile("");
      setNote("");
    } catch (error) {
      console.error("Error transferring ticket:", error);
      // You could show an error message if you wish
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpen}
      onRequestClose={async () => {
        await beforeClose();
        onClose();
      }}
      style={{
        content: {
          margin: 0,
          padding: 0,
          border: "none",
          borderRadius: "0.5rem 0.5rem 0 0",
          bottom: 0,
          left: 0,
          right: 0,
          top: "auto",
          background: "white",
          overflow: "hidden",
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 10001,
        },
      }}
      ariaHideApp={false}
    >
      <div
        className="rounded-t-lg shadow-lg p-4  pt-2 relative"
        ref={transferDetailModalRef}
      >
        {/* Header */}
        <div className="flex items-center justify-center border-b border-gray-300 pb-2 relative">
          <h2 className="text-xs font-bold uppercase">Transfer Tickets</h2>
        </div>

        {/* Ticket Summary */}
        <p className="text-sm font-normal mt-2">
          <p className="text-xs">
            {seatCount} Ticket(s) Selected <br />
          </p>
          Sec <span className="font-bold">{ticket.section || "GA"}</span> Row{" "}
          {ticket.row || "?"}
        </p>

        {/* Transfer Form */}
        <div className="mt-3 space-y-2 text-xs">
          <div className="space-y-1">
            <label className="block text-black font-medium">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-black font-medium">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-black font-medium">
              Email or Mobile Number
            </label>
            <input
              type="text"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-black font-medium">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2 h-20 outline-none resize-none"
            />
          </div>
        </div>

        <div className="border-t mt-1 border-gray-200  mb-12"></div>
        <button
          className="absolute left-2 flex bottom-6 items-center text-xs uppercase text-customBlue font-medium"
          onClick={async () => {
            await beforeClose();
            onClose();
          }}
        >
          <GoChevronRight className="rotate-180 mr-1" />
          Back
        </button>

        <button
          className="absolute right-2 bg-customBlue py-2 bottom-4 px-2 rounded-sm flex items-center text-xs uppercase text-white font-normal"
          onClick={handleTransfer}
        >
          Transfer {seatCount} Ticket(s)
        </button>
      </div>
    </Modal>
  );
}

export default TicketModal;
