"use client";

import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

const EventPlaceholderSVG = () => (
  <svg
    className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded mb-3"
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="400"
      height="300"
      fill="#f3f4f6"
      className="dark:fill-gray-700"
    />
    <circle
      cx="200"
      cy="150"
      r="60"
      fill="#e5e7eb"
      className="dark:fill-gray-600"
    />
    <path
      d="M200 120a30 30 0 1 0 0 60 30 30 0 0 0 0-60zm0 10a20 20 0 1 1 0 40 20 20 0 0 1 0-40z"
      fill="#9ca3af"
      className="dark:fill-gray-400"
    />
    <path
      d="M200 160a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
      fill="#6b7280"
      className="dark:fill-gray-300"
    />
  </svg>
);

const EmptyStateSVG = () => (
  <svg
    className="w-64 h-64 mb-6"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="200"
      height="200"
      fill="#f3f4f6"
      className="dark:fill-gray-700"
      rx="20"
    />
    <path
      d="M50 80c0-16.6 13.4-30 30-30h40c16.6 0 30 13.4 30 30v40c0 16.6-13.4 30-30 30H80c-16.6 0-30-13.4-30-30V80z"
      fill="#e5e7eb"
      className="dark:fill-gray-600"
    />
    <path
      d="M80 70c-5.5 0-10 4.5-10 10v40c0 5.5 4.5 10 10 10h40c5.5 0 10-4.5 10-10V80c0-5.5-4.5-10-10-10H80z"
      fill="#9ca3af"
      className="dark:fill-gray-500"
    />
    <path
      d="M100 100a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
      fill="#6b7280"
      className="dark:fill-gray-400"
    />
  </svg>
);

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
  const router = useRouter();

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
  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 font-semibold mb-4">
          ❌ Error: {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.pages?.[0]?.events?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <EmptyStateSVG />
        <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
        <p className="text-gray-500 mb-4">
          Check back later for upcoming events
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <div
        ref={scrollContainerRef}
        className="h-[600px] overflow-y-auto border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
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
                onClick={() => router.push(`/events/${event._id}`)}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 transition-transform transform hover:scale-[1.01] hover:shadow-xl hover:ring-2 hover:ring-blue-400/40 cursor-pointer"
              >
                {event.thumbnail ? (
                  <div className="relative w-full h-48 mb-3">
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      className="object-cover rounded transition-all duration-300"
                      unoptimized={
                        !event.thumbnail.includes("images.unsplash.com")
                      }
                    />
                  </div>
                ) : (
                  <EventPlaceholderSVG />
                )}
                <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-200 line-clamp-2">
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
