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
        root: container, // Observe inside the scrollable feed
        rootMargin: "100px",
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <h2 className="text-xl font-bold mb-4">Events</h2>

      {/* Scrollable Feed Container */}
      <div
        ref={scrollContainerRef}
        className="h-[600px] overflow-y-scroll border rounded p-2"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex flex-col space-y-4">
          {data?.pages.map((page) =>
            page.events.map((event: EventItem) => (
              <div
                key={event._id}
                className="bg-white dark:bg-gray-700 rounded shadow p-4"
              >
                {event.thumbnail && (
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-gray-700 dark:text-gray-200">
                  {event.description}
                </p>
              </div>
            ))
          )}

          {hasNextPage && (
            <div ref={loaderRef} className="text-center p-4 text-gray-500">
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
