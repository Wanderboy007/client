"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const registerUser = async (user: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!res.ok) throw new Error("Failed to register user");
  return res.json();
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    year: "",
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("User registered:", data);
      toast.success("Registration successful!");
      router.push("/login");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Register
        </h1>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="alumni">Alumni</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            <option value="">Select Year</option>
            <option value="first_year">First Year</option>
            <option value="second_year">Second Year</option>
            <option value="third_year">Third Year</option>
            <option value="final_year">Final Year</option>
            <option value="passed_out">Passed Out</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
