"use client";

import { Certificate } from "crypto";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  image: string;
  caption: string;
}

export default function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a fetch call
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          image: "/profile_images/Cert_1.jpg",
          caption: "Python Course",
        },
        {
          id: "2",
          image: "/profile_images/Cert_2.jpg",
          caption: "Photography Course",
        },
        {
          id: "3",
          image: "/profile_images/Cert_3.jpg",
          caption: "Sales Course",
        },
        {
          id: "4",
          image: "/profile_images/Cert_4.jpg",
          caption: "A & A Workshop",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src="/profile_images/DP_CCCM.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-500">Web Developer | Club Member</p>
          <p className="mt-2 text-sm text-gray-600">“Building cool stuff 👨‍💻”</p>
        </div>
      </div>

      {/* Posts Grid */}
      <h3 className="text-xl font-semibold mb-4">Certificates</h3>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="relative group">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-48 object-cover rounded shadow"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-50 text-white w-full p-2 text-sm opacity-0 group-hover:opacity-100 transition">
                {post.caption}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
