`use client`;
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Link
      href="/login"
      className="flex flex-col items-center justify-center h-screen"
    >
      Let's go
    </Link>
  );
}
