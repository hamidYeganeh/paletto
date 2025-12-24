import { LoginHeader } from "../components/LoginHeader";
import { LoginOutlet } from "../components/LoginOutlet";
import { useEffect } from "react";
import { useLoginLayoutStore } from "../store/LoginLayoutStore";

export const LoginView = () => {
  const resetLayout = useLoginLayoutStore((state) => state.reset);

  useEffect(() => {
    resetLayout();
  }, [resetLayout]);

  return (
    <main className="h-dvh">
      <LoginHeader />
      <LoginOutlet />
    </main>
  );
};
