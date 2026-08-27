import { Pacifico } from "next/font/google";
import type { HTMLAttributes } from "react";

const pacifico = Pacifico({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

export function TallyLogo({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`${pacifico.className} capitalize text-primary text-2xl ${className}`} {...props}>
      tally
    </span>
  );
}
