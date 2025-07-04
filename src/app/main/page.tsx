"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    fetch("/api/templates/signin").then((res) => {
      if (res.ok) {
        console.log("Sign-in template fetched successfully.");

        res.text().then((template) => {
          // Assuming you want to do something with the template
          console.log("Sign-in template:", template);
        });
      } else {
        console.error("Failed to fetch sign-in template.");
      }
    });
  }, []);
  return <div>Hi babe</div>;
}
