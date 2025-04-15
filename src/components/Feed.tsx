"use client";

import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

const fetchEvents = async ({ pageParam = 1 }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/event?page=${pageParam}`
  );
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export default function Feed() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ["events"],
      queryFn: fetchEvents,
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage?.events?.length > 0 ? pages.length + 1 : undefined,
    });

  useEffect(() => {
    const container = scrollContainerRef.current;
    const loader = loaderRef.current;

    if (!container || !loader || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "100px",
      }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <p className="text-center text-lg">⏳ Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 font-semibold">
        ❌ Error: {error.message}
      </p>
    );

  const fallbackImage = "https://source.unsplash.com/600x300/?event,tech";

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* <h2 className="text-2xl font-bold mb-4 text-center">
        🚀 Upcoming Events
      </h2> */}

      <div
        ref={scrollContainerRef}
        className="h-[600px] overflow-y-scroll border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex flex-col space-y-6">
          {data?.pages.map((page) =>
            page.events.map((event: EventItem) => (
              <div
                key={event._id}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 transition-transform transform hover:scale-[1.01] hover:shadow-xl hover:ring-2 hover:ring-blue-400/40 cursor-pointer"
              >
                <img
                  src={event.thumbnail || fallbackImage}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-3 transition-all duration-300"
                  // onError={(e) => {
                  //   e.currentTarget.src = fallbackImage;
                  // }}
                />
                <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-200">
                  {event.description}
                </p>
              </div>
            ))
          )}

          {hasNextPage && (
            <div ref={loaderRef} className="text-center p-4 text-gray-500">
              🔄 Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
