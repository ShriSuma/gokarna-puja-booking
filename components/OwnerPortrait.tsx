"use client";

import Image from "next/image";
import { useState } from "react";

export function OwnerPortrait({ alt }: { alt: string }) {
  const images = ["/owner/owner-new.jpg", "/owner/owner.jpg"];

  return (
    <div className="flex w-full md:w-auto snap-x snap-mandatory overflow-x-auto pb-4 gap-4 hide-scrollbar">
      {images.map((src, idx) => (
        <div key={src} className="shrink-0 snap-center first:ml-0 md:first:ml-auto">
          <Image
            src={src}
            alt={idx === 0 ? alt : `${alt} - Secondary`}
            width={224}
            height={224}
            className="h-48 w-48 rounded-full object-cover shadow-lg ring-4 ring-saffron-light/40 md:h-56 md:w-56"
            priority={idx === 0}
          />
        </div>
      ))}
    </div>
  );
}
