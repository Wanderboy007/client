"use client";
import { Home, Calendar, User, BookOpen, LogOut } from "lucide-react";
import { clearUser } from "@/app/store/userSlice";
import { useDispatch } from "react-redux";

interface LeftNavProps {
  setActiveComponent: (
    component: "feed" | "events" | "profile" | "scrapbook"
  ) => void;
  activeComponent: "feed" | "events" | "profile" | "scrapbook";
  variant?: "mobile" | "desktop";
  // Add this new prop
  onComponentChange?: (
    component: "feed" | "events" | "profile" | "scrapbook"
  ) => void;
}

export default function LeftNav({
  setActiveComponent,
  activeComponent,
  variant = "desktop",
  onComponentChange,
}: LeftNavProps) {
  const menuItems = [
    { id: "feed", label: "Feed", icon: <Home size={18} /> },
    { id: "events", label: "Events", icon: <Calendar size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "scrapbook", label: "Scrapbook", icon: <BookOpen size={18} /> },
  ];

  const dispatch = useDispatch();
  const isMobile = variant === "mobile";

  const handleClick = (
    component: "feed" | "events" | "profile" | "scrapbook"
  ) => {
    setActiveComponent(component);
    if (onComponentChange) {
      onComponentChange(component);
    }
  };

  return (
    <nav className="flex flex-col justify-between h-full space-y-4">
      <div>
        <h1 className="text-lg font-bold mb-4">CCCM</h1>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              handleClick(
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
      </div>

      <button
        onClick={() => dispatch(clearUser())}
        className="mt-auto flex items-center justify-center w-full px-4 py-2 text-black font-medium rounded-md hover:opacity-90 transition"
      >
        <LogOut size={18} className="mr-2" />
        Logout
      </button>
    </nav>
  );
}
