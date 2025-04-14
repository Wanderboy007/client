// components/LeftNav.tsx
"use client";

interface LeftNavProps {
  setActiveComponent: (component: "feed" | "events" | "profile") => void;
  activeComponent: "feed" | "events" | "profile";
}

export default function LeftNav({
  setActiveComponent,
  activeComponent,
}: LeftNavProps) {
  const menuItems = [
    { id: "feed", label: "Feed" },
    { id: "events", label: "Events" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 p-4 border-r">
      <h1 className="text-lg font-bold mb-5">CCCM</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="mb-2">
            <button
              onClick={() =>
                setActiveComponent(item.id as "feed" | "events" | "profile")
              }
              className={`w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700
                ${
                  activeComponent === item.id ? "font-bold text-blue-500" : ""
                }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
