"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useWebHaptics } from "web-haptics/react";

type ScanState = "idle" | "scanning" | "scanned";

const COPY: Record<ScanState, string> = {
  idle: "Scan document",
  scanning: "Scanning",
  scanned: "Scanned",
};

const SCANNING_MS = 3600;
const SCANNED_MS = 1400;

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
  const { trigger } = useWebHaptics();
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
      trigger("success");
      const timer = setTimeout(() => {
        setCopyReady(false);
        setState("idle");
      }, SCANNED_MS);
      return () => clearTimeout(timer);
    }
  }, [state, trigger]);

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
          scale: { type: "spring", bounce: 0.4, duration: 0.35 },
        }}
        onLayoutAnimationComplete={() => setCopyReady(true)}
        className="relative flex h-10 cursor-pointer items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base hover:bg-neutral-100/90 disabled:cursor-default before:absolute before:-inset-2 before:content-['']"
      >
        <motion.span
          layout
          transition={{
            layout:
              state === "idle" ? LAYOUT_SPRING_IDLE : LAYOUT_SPRING_ACTIVE,
          }}
          className="relative flex items-center gap-2 overflow-hidden [clip-path:inset(0)]"
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
                    y: { duration: 0.2, ease: "easeOut" },
                    opacity: { duration: 0.2 },
                    filter: { duration: 0.2 },
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
                    y: { duration: 0.2, ease: "easeOut" },
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
                          y: {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          opacity: { duration: 0.2 },
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
                y: { duration: state === "idle" ? 0 : 0.2, ease: "easeOut" },
                opacity: { duration: state === "idle" ? 0 : 0.2 },
                filter: { duration: state === "idle" ? 0 : 0.2 },
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
