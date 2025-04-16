"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/userSlice";

interface LoginUserInput {
  email: string;
  password: string;
}

interface LoginUserResponse {
  user: {
    _id: string;
    role: string;
    name: string;
  };
}

const LoginUser = async (user: LoginUserInput): Promise<LoginUserResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Failed to log in");
  return res.json();
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      console.log("User login:", data);

      // Assuming data.user = { _id, role, name } or similar
      const { _id, role, name } = data.user;
      console.log("login page" + _id + role + name);
      const validRoles: ("admin" | "student" | null)[] = [
        "admin",
        "student",
        null,
      ];
      const validatedRole = validRoles.includes(
        role as "admin" | "student" | null
      )
        ? (role as "admin" | "student" | null)
        : null;
      dispatch(setUser({ id: _id, role: validatedRole, name }));
      router.push("/main");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Login
        </h1>
        <div className="mb-4">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <input
            type="text"
            value={password}
            placeholder="password"
            onChange={(e) => setpassword(e.target.value)}
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
