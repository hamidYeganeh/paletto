import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <main className="bg-primary-100 h-dvh p-12">
      <div className="size-full flex items-center justify-center bg-secondary-200">
        <h1>WEB APP</h1>

        <Button appName="web">Button</Button>
      </div>
    </main>
  );
}
