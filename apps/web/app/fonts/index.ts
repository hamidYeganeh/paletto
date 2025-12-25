import localFont from "next/font/local";

export const yekanBakh = localFont({
  variable: "--font-yekanbakh",
  display: "swap",
  src: [
    {
      path: "./YekanBakh/YekanBakhFaNum-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./YekanBakh/YekanBakhFaNum-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./YekanBakh/YekanBakhFaNum-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./YekanBakh/YekanBakhFaNum-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

