// components/LeftNav.tsx

export default function LeftNav() {
  return (
    <nav className="flex flex-col items-start w-64 h-screen sticky top-0 bg-white dark:bg-gray-800 border-r p-4">
      <h1 className="text-2xl font-bold mb-8">MyApp</h1>
      <ul className="space-y-4 w-full">
        <li className="w-full">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left">
            Home
          </button>
        </li>
        <li className="w-full">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left">
            Search
          </button>
        </li>
        <li className="w-full">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left">
            Events
          </button>
        </li>
        <li className="w-full">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left">
            Messages
          </button>
        </li>
        <li className="w-full">
          <button className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded w-full text-left">
            Notifications
          </button>
        </li>
      </ul>
      {/* Add more nav items as needed */}
    </nav>
  );
}
