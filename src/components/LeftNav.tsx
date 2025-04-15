"use client";

import { Home, Calendar, User, BookOpen } from "lucide-react";

interface LeftNavProps {
  setActiveComponent: (
    component: "feed" | "events" | "profile" | "scrapbook"
  ) => void;
  activeComponent: "feed" | "events" | "profile" | "scrapbook";
  variant?: "mobile" | "desktop"; // Optional prop
}

export default function LeftNav({
  setActiveComponent,
  activeComponent,
  variant = "desktop", // Default to desktop
}: LeftNavProps) {
  const menuItems = [
    { id: "feed", label: "Feed", icon: <Home size={18} /> },
    { id: "events", label: "Events", icon: <Calendar size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "scrapbook", label: "Scrapbook", icon: <BookOpen size={18} /> },
  ];

  const isMobile = variant === "mobile";

  return (
    <nav className="space-y-2">
      <h1 className="text-lg font-bold mb-4">CCCM</h1>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() =>
            setActiveComponent(
              item.id as "feed" | "events" | "profile" | "scrapbook"
            )
          }
          className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition
            ${
              isMobile
                ? activeComponent === item.id
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/80 hover:bg-white/10"
                : activeComponent === item.id
                ? "bg-gray-200 dark:bg-gray-700 text-blue-600 font-semibold"
                : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
