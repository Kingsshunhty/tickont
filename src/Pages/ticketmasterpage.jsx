/*  src/pages/TicketmasterClone.jsx
    --------------------------------
    ▸ npm i qrcode.react          (for the QR)
    ▸ ensure Tailwind CSS is already configured in your project
*/ import { FiArrowUpRight } from "react-icons/fi";
import { RiMenu2Line } from "react-icons/ri";
import { BiReceipt } from "react-icons/bi";
// import React from "react";
import { TfiPrinter } from "react-icons/tfi";
import { PiPrinterLight } from "react-icons/pi";
import { RiInformationFill } from "react-icons/ri";
import { FaChevronDown, FaRegUser } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { TfiSearch } from "react-icons/tfi";
export default function TicketmasterClone() {

  const { search } = useLocation();
   const params = useMemo(() => new URLSearchParams(search), [search]);
   const eventTitle = params.get("eventTitle") || "Vinjerock 2024";
   const eventLocation = params.get("eventLocation") || "Vinjerock 2024";
  const quantity  = params.get("quantity")  || "1";
   const eventDateTime = params.get("eventDateTime") || "";
   const ticketId = params.get("ticketId") || "";
   const section = params.get("section") || "General Admission";
   const qrValue = ticketId || "W33CQ3VHT";
   const orderNo = ticketId || "33135213";
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* ───────────────── HEADER ───────────────── */}
      <header className="relative overflow-hidden">
        {/* blurry hero-image banner (mock) */}
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=60')] bg-cover bg-center blur-md" />

        {/* top bar: hamburger, logo, search, profile */}
        <div className="absolute top-0 inset-x-0 flex bg-white items-center px-3 py-4">
          <RiMenu2Line />

          <img
            src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/81d94a4c-1171-4900-992c-8a049f9d7ffc.png"
            alt="ticketmaster"
            className="w-28 ml-3"
          />

          <div className="ml-auto flex space-x-4">
            {/* search */}
            <TfiSearch />
            {/* profile */}
            <FaRegUser />
          </div>
        </div>

        {/* event breadcrumb & title */}
        <div className="px-4  text-sm text-white  absolute left-0 bottom-0 w-full bg-gradient-to-b from-transparent to-black/60 pb-4">
          <p className="opacity-70 -translate-y-6 font-opensans ">
          Home / My tickets / {eventTitle}
          </p>
          <p className="font-semibold">{eventTitle}</p>
          <p className="text-xs">{eventLocation}</p>
        </div>
      </header>

      {/* ───────────────── TAB BAR ───────────────── */}
      <nav className=" top-0 z-10 bg-blue-700 text-white text-sm font-medium flex">
        <div className="w-1/3 text-center py-2 border-b-2 border-white">
          Tickets
        </div>
        <div className="w-1/3 text-center py-2 opacity-80">More info </div>
        <div className="w-1/3 text-center py-2 opacity-80">Information</div>
      </nav>

      {/* ───────────────── MAIN CONTENT ───────────────── */}
      <main className="px-4 pb-24">
        {/* My tickets card */}
        <section className="pt-6">
          <h2 className="font-semibold text-lg">My tickets</h2>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <PiPrinterLight />
         x{quantity} e-tickets
          </p>

          {/* action row */}
          <div className="mt-4 flex flex-col gap-3 text-sm font-medium">
            <button className="border rounded flex items-center justify-center py-2">
              Download (Print)
              <TfiPrinter className="ml-2 text-customBlue" />
            </button>

            <div className="flex space-x-3">
              <button className="border rounded flex-1 py-3 relative flex items-center justify-center">
                Resale unavailable
                <TbDeviceUnknownFilled className="ml-2 text-customBlue text-xl" />
              </button>

              <button className="border text-white rounded flex bg-black items-center px-3">
                Transfer
                <FiArrowUpRight className="ml-2 text-white" />
              </button>
            </div>
          </div>

          {/* availability notice */}
          <div className="mt-6 shadow-xl border-t-4 border-customBlue p-4 ">
            <div className="flex">
              <RiInformationFill className="text-customBlue text-4xl" />
              <div>
                <p className="ml-2 font-semibold">
                  Your tickets are available.
                </p>
                <p className="ml-2 mt-3 text-sm">
                  Use your mobile to show the QR code below so it can be scanned
                  at the entrance.
                </p>
              </div>
            </div>
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="mt-4 ml-6 w-28"
            />
          </div>

          {/* ticket card with QR */}
          <div className="mt-6 border rounded shadow-md overflow-hidden">
            {/* gradient strip */}
            <div className="h-6 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 relative">
              <div className="absolute whitespace-nowrap animate-marquee text-white font-semibold text-sm">
                Ticketmaster • Ticketmaster • Ticketmaster • Ticketmaster •
                Ticketmaster •
              </div>
            </div>

            <div className="p-4">
              <p className="font-medium">{section}</p>
              <hr className="my-3" />
              <p>Unnumbered / Ref.</p>
              <hr className="my-3 border-dashed" />

              <div className="flex justify-center py-4">
                <QRCodeSVG value={qrValue} size={160} />
              </div>

              <p className="text-center text-xs text-gray-500">*{qrValue}*</p>
            </div>
          </div>

          {/* order summary */}
          <section className="mt-10 border-t border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Your order</h3>
            <p className="flex items-center text-sm">
              <BiReceipt className="text-gray-600 text-2xl" />
              Order #
            </p>
            <div className="flex ml-6 items-center  mt-0">
              <p>{orderNo}&nbsp;</p>
              <a href="#" className="text-blue-600 text-xs underline">
                View order confirmation
              </a>
            </div>
            <button className="mt-3 border border-purple-600 text-purple-700 rounded px-3 py-2 flex items-center text-sm">
              Need help with this order?
              <span className="ml-2 w-5 h-5 bg-purple-700 text-white rounded flex items-center justify-center text-xs">
                ?
              </span>
            </button>
          </section>
        </section>
      </main>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="bg-neutral-900 text-white px-4 h-full pt-8 pb-32">
        {/* brand & socials */}
        <img
          src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/81d94a4c-1171-4900-992c-8a049f9d7ffc.png"
          alt="ticketmaster"
          className="w-28"
        />

        <p className="mt-6 mb-2 font-medium">Follow us</p>
        <div className="flex space-x-4 text-white/80">
          {["facebook", "instagram", "tiktok"].map((i) => (
            <a key={i} href="#">
              <img
                src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${i}.svg`}
                alt={i}
                className="w-6 h-6 invert"
              />
            </a>
          ))}
        </div>

        {/* store badges */}
        <div className="mt-6 flex space-x-3">
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            className="h-10"
          />
        </div>

        {/* collapsible menu stubs */}
        <p className="mt-6 mb-4 text-sm">
          Here you can read more about our{" "}
          <a href="#" className="underline">
            terms of use
          </a>
        </p>

        {[
          "About Us",
          "Our products & services",
          "Become a part of Ticketmaster",
        ].map((txt) => (
          <details key={txt} className="border-t border-white/20 py-4">
            <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
              {txt}
              <FaChevronDown className="ml-2 text-white/70" />
            </summary>
            <p className="mt-2 text-sm text-white/70">
              (content hidden in this mock-up)
            </p>
          </details>
        ))}

        {/* partners */}
        <p className="mt-6 mb-2">Our partners</p>
        <div className="flex space-x-6">
          <span className="font-bold">LIVE NATION</span>
          <span className="font-bold">UNIVERSE</span>
        </div>

        {/* legal */}
        <p className="text-xs text-white/60 mt-8 space-x-1">
          <a href="#" className="underline">
            Purchase terms
          </a>{" "}
          |{" "}
          <a href="#" className="underline">
            Privacy
          </a>{" "}
          | Cookie policy | Manage my cookies
        </p>
        <p className="text-xs text-white/50 mt-4">
          © 1999-2024 Ticketmaster. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
