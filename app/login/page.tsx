"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logIn from "@/firebase/login";
import { useAuthContext } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuthContext();

  const handleForm = async (event: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    event.preventDefault();

    const { result, error } = await logIn(email, password);

    if (error) {
      setError("Error logging in.");
      setSubmitting(false);
      return console.error(error);
    }

    // else successful
    console.log(result);
    setSubmitting(false);
    return router.push("/admin");
  };

  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={handleForm}
        onChange={() => setError("")}
      >
        <input
          className="w-64 h-12 p-4 mb-2 rounded-lg border border-gray-300"
          type="text"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-64 h-12 p-4 mb-4 rounded-lg border border-gray-300"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-64 h-12 rounded-lg bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="submit"
          disabled={submitting}
        >
          Login
        </button>
        <p className="text-red-500 mt-2">{error}</p>
      </form>
    </div>
  );
};

export default Login;
