import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store"; // Adjust the path to your store file

const Scrapbook = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log("from redux = " + user.id);

  // Assuming user is stored in auth slice
  interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/${user.id}/myregisteredevents`,
          { withCredentials: true }
        );
        console.log(res);
        setEvents(res.data); // assuming res.data is the list of events
      } catch (err) {
        setError(
          (axios.isAxiosError(err) && err.response?.data?.message) ||
            "Failed to fetch events"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [user]); // Dependency on user

  if (loading) return <p>Loading your events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Registered Events</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t registered for any events yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="p-4 border rounded-xl shadow-md bg-white dark:bg-gray-900"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </p>
              <p className="text-sm text-gray-500">
                Location: {event.location}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scrapbook;
