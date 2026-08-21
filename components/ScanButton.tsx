"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type ScanState = "idle" | "scanning" | "scanned";

const COPY: Record<ScanState, string> = {
  idle: "Scan document",
  scanning: "Scanning",
  scanned: "Scanned",
};

const SCANNING_MS = 3600;
const SCANNED_MS = 1400;

function playSound(src: string) {
  const audio = new Audio(src);
  audio.play().catch(() => {});
}

export default function ScanButton() {
  const [state, setState] = useState<ScanState>("idle");

  useEffect(() => {
    if (state === "scanning") {
      const timer = setTimeout(() => setState("scanned"), SCANNING_MS);
      return () => clearTimeout(timer);
    }
    if (state === "scanned") {
      playSound("/sound/action-confirmed.mp3");
      const timer = setTimeout(() => setState("idle"), SCANNED_MS);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <motion.button
      layout
      type="button"
      onClick={() => {
        if (state !== "idle") return;
        playSound("/sound/button-click.mp3");
        setState("scanning");
      }}
      disabled={state !== "idle"}
      whileTap={state === "idle" ? { scale: 0.94 } : undefined}
      transition={{
        layout: { type: "spring", bounce: 0.15, duration: 0.32 },
        scale: { duration: 0.2, ease: "easeOut" },
      }}
      className="relative flex h-10 cursor-pointer items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base hover:bg-neutral-100/90 disabled:cursor-default before:absolute before:-inset-2 before:content-['']"
    >
      <motion.span
        layout
        className="relative flex items-center gap-2 overflow-hidden [clip-path:inset(0)]"
      >
        <motion.span
          layout
          className="relative grid h-4 w-4 shrink-0 place-items-center"
        >
          <AnimatePresence initial={false}>
            {state === "scanned" ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                transition={{
                  scale: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.2 },
                  filter: { duration: 0.2 },
                }}
                className="[grid-area:1/1] flex h-4 w-4 items-center justify-center"
              >
                <Image src="/circle-check.svg" alt="" width={16} height={16} />
              </motion.span>
            ) : (
              <motion.span
                key="file"
                initial={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }}
                transition={{
                  scale: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.2 },
                  filter: { duration: 0.2 },
                }}
                className="[grid-area:1/1] grid h-4 w-4 place-items-center overflow-visible"
              >
                <Image
                  src="/File.svg"
                  alt=""
                  width={13}
                  height={16}
                  className="[grid-area:1/1]"
                />
                {state === "scanning" && (
                  <motion.div
                    className="pointer-events-none [grid-area:1/1]"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: [-8, 8, -8], opacity: 1 }}
                    transition={{
                      y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <Image src="/Scanner.svg" alt="" width={36} height={10} />
                  </motion.div>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            layout
            key={state}
            initial={{ opacity: 0, y: 2, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -2, filter: "blur(2px)" }}
            transition={{
              y: { duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 },
            }}
          >
            {COPY[state]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
