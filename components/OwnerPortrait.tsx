"use client";

import Image from "next/image";
import { useState } from "react";

export function OwnerPortrait({ alt }: { alt: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div
        className="flex h-48 w-48 items-center justify-center rounded-full border-2 border-maroon/20 bg-sandstone-200 shadow-inner md:h-56 md:w-56"
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-4xl text-maroon/40">ॐ</span>
      </div>
    );
  }
  return (
    <Image
      src="/owner/owner.jpg"
      alt={alt}
      width={224}
      height={224}
      className="h-48 w-48 rounded-full object-cover shadow-lg ring-4 ring-saffron-light/40 md:h-56 md:w-56"
      onError={() => setBroken(true)}
      priority
    />
  );
}
