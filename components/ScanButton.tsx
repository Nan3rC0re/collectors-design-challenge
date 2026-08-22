"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type ScanState = "idle" | "scanning" | "scanned";

const COPY: Record<ScanState, string> = {
  idle: "Scan document",
  scanning: "Scanning",
  scanned: "Scanned",
};

export const SCANNING_MS = 3600;
export const SCANNED_MS = 1400;

// Duration of the icon/copy blur-crossfade whenever content swaps (state
// change, or the scanner-sweep fading in). Shared with the loop demo
// buttons so their reveal timing can't drift from the real component.
export const REVEAL_TRANSITION_S = 0.2;

export const SCANNER_SWEEP_TRANSITION = {
  duration: 1.8,
  repeat: Infinity,
  ease: "easeInOut",
} as const;

export const TAP_SCALE_TRANSITION = {
  type: "spring",
  bounce: 0.4,
  duration: 0.35,
} as const;

const SOUND_SRC = {
  click: "/sound/button-click.mp3",
  confirmed: "/sound/action-confirmed.mp3",
} as const;

const LAYOUT_SPRING_IDLE = {
  type: "spring",
  bounce: 0,
  duration: 0.12,
} as const;
const LAYOUT_SPRING_ACTIVE = {
  type: "spring",
  bounce: 0.15,
  duration: 0.32,
} as const;

export default function ScanButton() {
  const [state, setState] = useState<ScanState>("idle");
  const [copyReady, setCopyReady] = useState(true);
  const sounds = useRef<
    Partial<Record<keyof typeof SOUND_SRC, HTMLAudioElement>>
  >({});

  useEffect(() => {
    for (const [key, src] of Object.entries(SOUND_SRC) as [
      keyof typeof SOUND_SRC,
      string,
    ][]) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.load();
      sounds.current[key] = audio;
    }
  }, []);

  const playSound = (key: keyof typeof SOUND_SRC) => {
    const audio = sounds.current[key];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (state === "scanning") {
      const timer = setTimeout(() => setState("scanned"), SCANNING_MS);
      return () => clearTimeout(timer);
    }
    if (state === "scanned") {
      playSound("confirmed");
      const timer = setTimeout(() => {
        setCopyReady(false);
        setState("idle");
      }, SCANNED_MS);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      >
        <Image src="/circle-check.svg" alt="" width={16} height={16} priority />
        <Image src="/Scanner.svg" alt="" width={50} height={14} priority />
      </div>
      <motion.button
        layout
        type="button"
        onClick={() => {
          if (state !== "idle") return;
          playSound("click");
          setState("scanning");
        }}
        disabled={state !== "idle"}
        whileTap={state === "idle" ? { scale: 0.92 } : undefined}
        animate={{ scale: state === "scanning" ? 0.92 : 1 }}
        transition={{
          layout: state === "idle" ? LAYOUT_SPRING_IDLE : LAYOUT_SPRING_ACTIVE,
          scale: TAP_SCALE_TRANSITION,
        }}
        onLayoutAnimationComplete={() => setCopyReady(true)}
        className="group relative flex cursor-pointer items-center rounded-full p-2 -m-2 disabled:cursor-default"
      >
        <motion.span
          layout
          transition={{
            layout:
              state === "idle" ? LAYOUT_SPRING_IDLE : LAYOUT_SPRING_ACTIVE,
          }}
          className="relative flex h-10 items-center gap-2 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base [clip-path:inset(0)] group-hover:bg-neutral-100/90"
        >
          <motion.span
            layout
            transition={{
              layout:
                state === "idle" ? LAYOUT_SPRING_IDLE : LAYOUT_SPRING_ACTIVE,
            }}
            className="relative grid h-4 w-4 shrink-0 place-items-center"
          >
            <AnimatePresence initial={false}>
              {state === "scanned" ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, y: 2, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -2, filter: "blur(16px)" }}
                  transition={{
                    y: { duration: REVEAL_TRANSITION_S, ease: "easeOut" },
                    opacity: { duration: REVEAL_TRANSITION_S },
                    filter: { duration: REVEAL_TRANSITION_S },
                  }}
                  className="[grid-area:1/1] flex h-4 w-4 items-center justify-center"
                >
                  <Image
                    src="/circle-check.svg"
                    alt=""
                    width={16}
                    height={16}
                    priority
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="file"
                  initial={{ opacity: 0, y: 2, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -2, filter: "blur(16px)" }}
                  transition={{
                    y: { duration: REVEAL_TRANSITION_S, ease: "easeOut" },
                    opacity: { duration: REVEAL_TRANSITION_S },
                    filter: { duration: REVEAL_TRANSITION_S },
                  }}
                  className="[grid-area:1/1] grid h-4 w-4 place-items-center overflow-visible"
                >
                  <Image
                    src="/File.svg"
                    alt=""
                    width={13}
                    height={16}
                    className="[grid-area:1/1]"
                    priority
                  />
                  <AnimatePresence>
                    {state === "scanning" && (
                      <motion.div
                        key="scanner"
                        className="pointer-events-none [grid-area:1/1]"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: [-8, 8, -8], opacity: 1 }}
                        transition={{
                          y: SCANNER_SWEEP_TRANSITION,
                          opacity: { duration: REVEAL_TRANSITION_S },
                        }}
                      >
                        <Image
                          src="/Scanner.svg"
                          alt=""
                          width={50}
                          height={14}
                          priority
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              layout
              key={state}
              initial={{ opacity: 0, y: 2, filter: "blur(4px)" }}
              animate={
                copyReady
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 2, filter: "blur(4px)" }
              }
              exit={{ opacity: 0, y: -2, filter: "blur(4px)" }}
              transition={{
                layout:
                  state === "idle" ? LAYOUT_SPRING_IDLE : LAYOUT_SPRING_ACTIVE,
                y: {
                  duration: state === "idle" ? 0 : REVEAL_TRANSITION_S,
                  ease: "easeOut",
                },
                opacity: {
                  duration: state === "idle" ? 0 : REVEAL_TRANSITION_S,
                },
                filter: {
                  duration: state === "idle" ? 0 : REVEAL_TRANSITION_S,
                },
              }}
            >
              {COPY[state]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.button>
    </>
  );
}
