// pages/profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store"; // Adjust the path to your store file

interface User {
  name: string;
  email: string;
  role: string;
  year?: string;
  profile?: string;
  assigned_roles?: string[];
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const user1 = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/${user1.id}/getuser`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl">
      <div className="flex items-center gap-6">
        {user.profile ? (
          <img
            src={user.profile}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
            {user.name[0]}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {user.role}
          </span>
          {user.year && (
            <span className="inline-block ml-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {user.year.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      {user.assigned_roles && user.assigned_roles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Assigned Roles:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {user.assigned_roles.map((role, idx) => (
              <li key={idx}>{role}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
