"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";

const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  branch: string;
  thumbnail?: string;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
      credentials: "include",
    });
    // Check if the response was successful
    if (!res.ok) {
      throw new Error(`Failed to create event. Status: ${res.status}`);
    }

    return await res.json(); // Parse and return the response as JSON
  } catch (error) {
    console.error("Error during event creation:", error);
    throw error; // Rethrow error so it can be handled in the calling code
  }
};

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    branch: "",
  });
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success("✅ Event created successfully!");
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (!thumbnailUrl) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    mutation.mutate({
      ...formData,
      thumbnail: thumbnailUrl,
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-extrabold text-center mb-6"></h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Category</option>
          <option value="seminar">Seminar</option>
          <option value="workshop">Workshop</option>
          <option value="conference">Conference</option>
        </select>

        {/* Branch Dropdown */}
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Branch</option>
          <option value="cse">Computer Science</option>
          <option value="ece">Electronics</option>
          <option value="mech">Mechanical</option>
        </select>

        {/* Thumbnail Upload */}
        <div>
          <label className="block mb-2 font-medium">Event Thumbnail*</label>
          <UploadButton
            endpoint="eventThumbnail"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setThumbnailUrl(res[0].url);
              setIsUploading(false);
              toast.success("Thumbnail uploaded successfully!");
            }}
            onUploadError={(error) => {
              setIsUploading(false);
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button: "ut-ready:bg-blue-500 ut-uploading:cursor-not-allowed",
            }}
          />
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt="Thumbnail preview"
              className="w-40 h-40 object-cover rounded-lg border"
              width={160}
              height={160}
            />
          )}
          {isUploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading thumbnail...</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="cursor-pointer"
            required
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            I accept the{" "}
            <a href="/terms" className="text-blue-500 underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending || isUploading}
          className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
            mutation.isPending || isUploading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {mutation.isPending ? "Creating Event..." : " Create Event"}
        </button>
      </form>
    </div>
  );
}
