// app/events/[eventId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { RootState } from "../../store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "react-toastify";
import { EventImageUploader } from "@/components/EventImageUploader";

interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  registeredUsers: string[];
  eventimages: string[];
  thumbnail?: string;
}

export default function EventPage() {
  const router = useRouter();
  const { eventId } = useParams() as { eventId: string };
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  // Debugging log
  console.log("Rendering EventPage with eventId:", eventId);

  //delete event
  const handleDeleteEvent = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Event deleted successfully");
      router.push("/main");
      // Redirect or refetch events
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete event");
      } else {
        toast.error("Failed to delete event");
      }
    }
  };

  // Fetch event data
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<IEvent>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}`
        );
        console.log("Fetched event data:", data); // Debug log
        return data;
      } catch (err) {
        console.error("Error fetching event:", err);
        throw err;
      }
    },
    retry: false,
  });

  // Debugging logs
  useEffect(() => {
    console.log("Current event state:", { event, isLoading, error });
  }, [event, isLoading, error]);

  // Registration mutation
  const { mutate: toggleRegistration } = useMutation({
    mutationFn: async () => {
      const endpoint =
        user.id && event?.registeredUsers.includes(user.id)
          ? "unregister"
          : "register";
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}/${endpoint}`,
        {
          userId: user.id,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      toast.success(
        user.id && event?.registeredUsers.includes(user.id)
          ? "Unregistered successfully"
          : "Registered successfully"
      );
    },
    onError: (error: unknown) => {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Registration update failed"
        );
      } else {
        toast.error("Registration update failed");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="border-2 border-blue-500 rounded-full w-8 h-8 border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error loading event
        </h2>
        <p className="text-gray-600 mb-4">
          {axios.isAxiosError(error)
            ? error.response?.data?.message
            : "Failed to load event details"}
        </p>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Event Thumbnail */}
        {event.thumbnail && (
          <div className="relative h-64 w-full">
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Event Details */}
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">
                {event.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>

            {/* {user.role === "admin" && (
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                className="ml-auto"
              >
                Delete Event
              </Button>
            )} */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" />
              <span className="dark:text-gray-200">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-500" />
              <span className="dark:text-gray-200">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-500" />
              <span className="dark:text-gray-200">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-gray-500" />
              <span className="dark:text-gray-200">
                {event.registeredUsers.length} participants
              </span>
            </div>
          </div>

          {user.role === "admin" ? (
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              className="w-full md:w-auto"
            >
              Delete Event
            </Button>
          ) : (
            <Button
              onClick={() => toggleRegistration()}
              className="w-full md:w-auto"
              variant={
                user.id && event.registeredUsers.includes(user.id)
                  ? "destructive"
                  : "default"
              }
            >
              {user.id && event.registeredUsers.includes(user.id)
                ? "Leave Event"
                : "Join Event"}
            </Button>
          )}

          {/* Image Gallery */}
          {event.eventimages?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold dark:text-white">
                Event Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.eventimages.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Event image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {user.role === "admin" && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold dark:text-white">
                Add Event Images
              </h3>
              <EventImageUploader eventId={eventId} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
