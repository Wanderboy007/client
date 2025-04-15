"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeftNav from "@/components/LeftNav";

const Feed = dynamic(() => import("@/components/Feed"));
const Scrapbook = dynamic(() => import("@/components/Scrapbook"));

type ComponentKey = "feed" | "events" | "profile" | "scrapbook";

export default function MainPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("feed");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderMainContent = () => {
    switch (activeComponent) {
      case "feed":
        return <Feed />;
      case "events":
        return <>events</>;
      case "profile":
        return <>profile</>;
      case "scrapbook":
        return <Scrapbook />;
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
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Animated Sidebar */}
            <motion.div
              className="fixed top-0 left-0 w-64 h-full z-50 text-white shadow-lg bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-4">
                <button
                  className="mb-4 text-sm text-black"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Close
                </button>
                <LeftNav
                  setActiveComponent={(comp) => {
                    setActiveComponent(comp);
                    setIsMobileNavOpen(false);
                  }}
                  activeComponent={activeComponent}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-800 p-4">
        <LeftNav
          setActiveComponent={setActiveComponent}
          activeComponent={activeComponent}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">{renderMainContent()}</main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-64 border-l p-4 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-2">Suggestions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          More content here...
        </p>
      </aside>
    </div>
  );
}
