import { Pacifico } from "next/font/google";
import type { HTMLAttributes } from "react";

const pacifico = Pacifico({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

export function TallyLogo({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[
        pacifico.className,
        "inline-flex items-center leading-none tracking-[-0.08em] text-primary",
        className,
      ].join(" ")}
      {...props}
    >
      Tally
    </span>
  );
}
