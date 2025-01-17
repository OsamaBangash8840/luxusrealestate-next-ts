'use client';
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const GoogleAuth = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuccessRedirect = () => {
    console.log(handleSuccessRedirect)
    router.push("/properties"); // Redirect to the profile page or home page after successful login
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1092778869689-egbbkv6e16ovjmsf3lf3ls88tk888jgo.apps.googleusercontent.com"}>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Login with Google</h1>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
