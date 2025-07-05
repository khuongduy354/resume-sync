"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect to the main page
    window.location.href = "/login";
  }, []);
  return <div></div>;
}
