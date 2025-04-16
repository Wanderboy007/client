"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export function EventImageUploader({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
      <UploadDropzone
        endpoint="eventImages"
        onClientUploadComplete={(res) => {
          const imageUrls = res.map((file) => file.url);

          // Send to your Node.js backend
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/event/${eventId}/images`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                // Add auth headers if needed
              },
              body: JSON.stringify({ images: imageUrls }),
              credentials: "include",
            }
          )
            .then((response) => {
              if (!response.ok) throw new Error("Upload failed");
              queryClient.invalidateQueries({ queryKey: ["event", eventId] });
              toast.success("Images added to event!");
            })
            .catch((error) => {
              console.error("Upload error:", error);
              toast.error("Failed to save images");
            });
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        appearance={{
          label: "text-blue-600 hover:text-blue-700",
          allowedContent: "text-gray-500 dark:text-gray-400",
          button: "ut-ready:bg-blue-500 ut-uploading:bg-blue-500/50",
        }}
      />
    </div>
  );
}
