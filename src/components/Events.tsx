'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const createEvent = async (eventData: FormData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
    method: 'POST',
    body: eventData,
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    branch: '',
  });

  const [eventImages, setEventImages] = useState<File[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success('✅ Event created successfully!');
      setTimeout(() => {
        router.push('/events');
      }, 1000);
    },
    onError: () => {
      toast.error('Something went wrong. Try again.');
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setEventImages(Array.from(e.target.files));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    eventImages.forEach((file) => data.append('images', file));
    data.append('organizer', 'USER_ID_HERE');

    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-extrabold text-center mb-6">🎉 Create a New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {['title', 'date', 'time', 'location'].map((field, i) => (
          <input
            key={i}
            type={field === 'date' || field === 'time' ? field : 'text'}
            name={field}
            placeholder={field === 'title' || field === 'location' ? field.charAt(0).toUpperCase() + field.slice(1) : ''}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            required
          />
        ))}

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Category</option>
          <option value="seminar">Seminar</option>
          <option value="webinar">Webinar</option>
          <option value="coding_challenge">Coding Challenge</option>
          <option value="cultural">Cultural</option>
          <option value="technical">Technical</option>
        </select>

        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Engineering Branch</option>
          <option value="all">All Branches</option>
          <option value="cse">Computer Science Engineering</option>
          <option value="ece">Electronics & Communication Engineering</option>
          <option value="me">Mechanical Engineering</option>
          <option value="ce">Civil Engineering</option>
          <option value="ee">Electrical Engineering</option>
          <option value="it">Information Technology</option>
          <option value="ae">Aeronautical Engineering</option>
          <option value="bt">Biotechnology</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-3 rounded-lg"
        />

        <div className="flex gap-3 flex-wrap">
          {eventImages.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt={`Preview ${idx}`}
              className="w-20 h-20 object-cover rounded-lg border shadow"
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            I accept the{' '}
            <a href="/terms" className="text-blue-500 underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
            mutation.isPending
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        >
          {mutation.isPending ? 'Creating Event...' : '🚀 Create Event'}
        </button>
      </form>
    </div>
  );
}
