import Link from "next/link";
import Checkbox from '@repo/ui/Checkbox'

export default function Home() {
  return (
    <main className="bg-blue-500 min-h-dvh h-dvh p-4 flex items-center justify-center flex-col gap-4">
      <Link href={"/login"}>LOGIN</Link>

      <Checkbox color={'black'} />
    </main>
  );
}
