"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SCANNER_SWEEP_TRANSITION } from "./ScanButton";

export default function LoopButton() {
  return (
    <div className="flex h-10 scale-[0.92] items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base">
      <span className="relative grid h-4 w-4 shrink-0 place-items-center overflow-visible">
        <Image
          src="/File.svg"
          alt=""
          width={13}
          height={16}
          className="[grid-area:1/1]"
          priority
        />
        <motion.div
          className="pointer-events-none [grid-area:1/1]"
          animate={{ y: [-8, 8, -8] }}
          transition={SCANNER_SWEEP_TRANSITION}
        >
          <Image src="/Scanner.svg" alt="" width={50} height={14} priority />
        </motion.div>
      </span>
      Scanning
    </div>
  );
}
