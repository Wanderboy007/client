"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeftNav from "@/components/LeftNav";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";

const Feed = dynamic(() => import("@/components/Feed"));
const Scrapbook = dynamic(() => import("@/components/Scrapbook"));
const Event = dynamic(() => import("@/components/Events"));
const Profile = dynamic(() => import("@/components/Profile"));
const MyRegisteredEvents = dynamic(
  () => import("@/components/MyRegisteredEvents")
);

type ComponentKey =
  | "feed"
  | "events"
  | "profile"
  | "scrapbook"
  | "mycreatedevents"
  | "myregisteredevents";

export default function MainPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("feed");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  console.log("from redux = " + user.id);

  const renderMainContent = () => {
    switch (activeComponent) {
      case "feed":
        return <Feed />;
      case "events":
        return <Event />;
      case "profile":
        return <Profile />;
      case "scrapbook":
        return <Scrapbook />;
      case "mycreatedevents":
        return <div>My Created Events Component (To be created)</div>;

      case "myregisteredevents":
        return <MyRegisteredEvents />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-lg font-bold">CCCM</h1>
        <button onClick={() => setIsMobileNavOpen(true)}>
          <Menu size={24} />
        </button>
      </header>
      {/* AnimatePresence for mobile sidebar */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-transparent z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Animated Sidebar */}
            <motion.div
              className="fixed top-0 left-0 w-64 h-full z-50 text-white shadow-lg bg-white overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-4">
                {/* Improved Close Button */}
                <button
                  className="mb-4 text-sm bg-white text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Close
                </button>

                {/* Sidebar Content */}
                <div className="overflow-hidden">
                  <LeftNav
                    setActiveComponent={(comp) => {
                      setActiveComponent(comp);
                      setIsMobileNavOpen(false);
                    }}
                    activeComponent={activeComponent}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-500 p-4">
        <LeftNav
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
          variant="desktop"
        />
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4">{renderMainContent()}</main>
      {/* Right Sidebar */}
      <aside className="hidden lg:block w-64 border-l p-4 bg-white dark:bg-gray-500">
        <h3 className="font-bold mb-2">Suggestions </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          More content here Comming Soon...
        </p>
      </aside>
    </div>
  );
}
