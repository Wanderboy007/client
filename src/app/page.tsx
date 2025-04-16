"use client";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
          Welcome to Club Management Portal
        </h1>
        <p className="text-xl mb-8 drop-shadow-sm">
          Streamline your campus club experience. Join events, manage teams, and
          stay connected — all in one place.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href={"/login"}
            className="bg-white text-indigo-600 hover:bg-indigo-100 px-6 py-3 text-lg rounded-xl font-semibold shadow-lg transition duration-300"
          >
            Login
          </Link>
          <Link
            href={"/signup"}
            className="bg-transparent border border-white hover:bg-white hover:text-purple-600 px-6 py-3 text-lg rounded-xl font-semibold shadow-lg transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
