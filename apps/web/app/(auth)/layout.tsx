import { PropsWithChildren } from "react";

export default function AuthRootLayout(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div className="bg-primary-500 min-h-dvh h-full">
      <div>{children}</div>
    </div>
  );
}
