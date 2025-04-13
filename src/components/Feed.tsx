// components/Feed.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface EventItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function Feed() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch events from an API
  const fetchEvents = useCallback(async () => {
    try {
      // Example API endpoint:
      const res = await fetch(`/api/events?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      if (data.events) {
        // Append new events
        setEvents((prev) => [...prev, ...data.events]);
        setHasMore(data.events.length > 0); // If no new events, no more results
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Intersection Observer to detect when loaderRef is in view
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Load next page
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" } // adjust the margin as needed
    );

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loaderRef, hasMore]);

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* Feed title or heading can go here */}
      <h2 className="text-xl font-bold mb-4">Events</h2>

      <div className="flex flex-col space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-700 rounded shadow p-4"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-700 dark:text-gray-200">
              {event.description}
            </p>
          </div>
        ))}

        {/* Loader element (Hidden if no more results) */}
        {hasMore && (
          <div ref={loaderRef} className="text-center p-4 text-gray-500">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
