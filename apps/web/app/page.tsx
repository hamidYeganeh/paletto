import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-primary-100 min-h-dvh h-dvh p-4">
      <Link href={"/login"}>LOGIN</Link>
    </main>
  );
}
