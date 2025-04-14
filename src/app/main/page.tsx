// app/main/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LeftNav from "@/components/LeftNav";

// Dynamic imports for potentially heavy components.
const Feed = dynamic(() => import("@/components/Feed"));
// const Events = dynamic(() => import("@/components/Events"));
// const Profile = dynamic(() => import("@/components/Profile"));

type ComponentKey = "feed" | "events" | "profile";

export default function MainPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("feed");

  const renderMainContent = () => {
    switch (activeComponent) {
      case "feed":
        return <Feed />;
      case "events":
        // return <Events />;
        <>events</>;
      case "profile":
        // return <Profile />;
        <>profile</>;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Left Navigation */}
      <LeftNav
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />

      {/* Center Controlled Content */}
      <div className="flex-1 flex flex-col items-center p-4">
        {renderMainContent()}
      </div>

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
