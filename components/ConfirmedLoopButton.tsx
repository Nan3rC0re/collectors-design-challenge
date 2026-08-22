"use client";

import { motion, type Transition } from "motion/react";
import Image from "next/image";
import { REVEAL_TRANSITION_S, SCANNED_MS } from "./ScanButton";

const HOLD_S = SCANNED_MS / 1000;
const CYCLE_S = HOLD_S + REVEAL_TRANSITION_S;
const REVEAL_ANIMATE = {
  opacity: [0, 1, 1, 0],
  y: [2, 0, 0, -2],
  filter: ["blur(16px)", "blur(0px)", "blur(0px)", "blur(16px)"],
};
const REVEAL_TRANSITION: Transition = {
  duration: CYCLE_S,
  times: [
    0,
    REVEAL_TRANSITION_S / CYCLE_S,
    (CYCLE_S - REVEAL_TRANSITION_S) / CYCLE_S,
    1,
  ],
  repeat: Infinity,
  ease: "easeOut",
};

export default function ConfirmedLoopButton() {
  return (
    <div className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base">
      <span className="relative grid h-4 w-4 shrink-0 place-items-center overflow-visible">
        <motion.span
          className="[grid-area:1/1] flex h-4 w-4 items-center justify-center"
          animate={REVEAL_ANIMATE}
          transition={REVEAL_TRANSITION}
        >
          <Image
            src="/circle-check.svg"
            alt=""
            width={16}
            height={16}
            priority
          />
        </motion.span>
      </span>
      <motion.span animate={REVEAL_ANIMATE} transition={REVEAL_TRANSITION}>
        Scanned
      </motion.span>
    </div>
  );
}
