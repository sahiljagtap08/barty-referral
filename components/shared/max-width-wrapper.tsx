import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({
  className,
  children,
  large = false,
  customMaxWidth,
}: {
  className?: string;
  large?: boolean;
  customMaxWidth?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "container",
        customMaxWidth || (large ? "max-w-screen-2xl" : "max-w-6xl"),
        className,
      )}
    >
      {children}
    </div>
  );
}
