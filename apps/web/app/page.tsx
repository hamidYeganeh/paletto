import { Button } from "@repo/ui/Button";

export default function Home() {
  return (
    <main className="bg-primary-100 h-dvh p-12">
      <div className="size-full flex items-center justify-center bg-secondary-200">
        <h1 className="text-primary-950">WEB APP</h1>

        <Button>Button</Button>
      </div>
    </main>
  );
}
