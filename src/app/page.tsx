import Link from "next/link";
import MAIN from "./main/page";

export default function Home() {
  return (
    <div>
      <Link
        href="/login"
        className="flex flex-col items-center justify-center h-screen"
      >
        Let's go
      </Link>

      <MAIN />
    </div>
  );
}
