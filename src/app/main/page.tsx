// app/main/page.tsx
import LeftNav from "@/components/LeftNav";
import Feed from "@/components/Feed";

export default function MainPage() {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Left Navigation */}
      <LeftNav />

      {/* Center Feed */}
      <div className="flex-1 flex flex-col items-center">
        <Feed />
      </div>

      {/* (Optional) Right Sidebar */}
      <aside className="hidden lg:block w-64 border-l p-4 bg-white dark:bg-gray-800">
        {/* Here you might put suggestions, user profile snippet, etc. */}
        <h3 className="font-bold mb-2">Suggestions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          More content here...
        </p>
      </aside>
    </div>
  );
}
