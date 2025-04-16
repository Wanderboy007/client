import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ScrapbookEvent {
  eventId: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  images: string[];
  category: string;
  location: string;
}

const Scrapbook = () => {
  const user = useSelector((state: RootState) => state.user);
  const [scrapbookData, setScrapbookData] = useState<ScrapbookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lightbox/gallery state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchScrapbook = async () => {
      try {
        if (!user?.id) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/event/${user.id}/getscrapbook`,
          { withCredentials: true }
        );
        setScrapbookData(response.data.scrapbook);

        // Prepare all images array for the gallery
        const images = response.data.scrapbook.flatMap(
          (event: ScrapbookEvent) =>
            [event.thumbnail, ...event.images].filter(Boolean)
        );
        setAllImages(images);
      } catch (err) {
        setError("Failed to load scrapbook data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScrapbook();
  }, [user]);

  const openImage = (image: string) => {
    setSelectedImage(image);
    setCurrentImageIndex(allImages.indexOf(image));
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    let newIndex;
    if (direction === "prev") {
      newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    } else {
      newIndex = (currentImageIndex + 1) % allImages.length;
    }
    setCurrentImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === "Escape") closeImage();
        if (e.key === "ArrowLeft") navigateImage("prev");
        if (e.key === "ArrowRight") navigateImage("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex, navigateImage]);

  if (loading)
    return <div className="text-center py-8">Loading scrapbook...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user)
    return (
      <div className="text-center py-8">
        Please login to view your scrapbook
      </div>
    );
  if (scrapbookData.length === 0)
    return (
      <div className="text-center py-8">No events found in your scrapbook</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Scrapbook</h1>

      {/* Masonry-style image grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {scrapbookData.flatMap((event) =>
          [event.thumbnail, ...event.images]
            .filter(Boolean)
            .map((image, idx) => (
              <div
                key={`${event.eventId}-${idx}`}
                className="break-inside-avoid relative group cursor-zoom-in"
                onClick={() => openImage(image)}
              >
                <Image
                  src={image}
                  alt={`${event.title} image ${idx + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg object-cover transition-transform group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    {event.title}
                  </span>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Image lightbox/modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            <FiX size={28} />
          </button>

          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-4 text-white text-2xl hover:text-gray-300 md:left-8"
          >
            <FiChevronLeft size={32} />
          </button>

          <div className="relative max-w-full max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Enlarged scrapbook image"
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
              priority
            />
          </div>

          <button
            onClick={() => navigateImage("next")}
            className="absolute right-4 text-white text-2xl hover:text-gray-300 md:right-8"
          >
            <FiChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scrapbook;
