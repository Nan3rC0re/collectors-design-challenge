"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { TAP_SCALE_TRANSITION } from "./ScanButton";

const CLICK_SOUND_SRC = "/sound/button-click.mp3";

export default function TapButton() {
  const sound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(CLICK_SOUND_SRC);
    audio.preload = "auto";
    audio.load();
    sound.current = audio;
  }, []);

  const playClick = () => {
    const audio = sound.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <motion.button
      type="button"
      onClick={playClick}
      whileTap={{ scale: 0.92 }}
      transition={TAP_SCALE_TRANSITION}
      className="group relative flex cursor-pointer items-center rounded-full p-2 -m-2"
    >
      <span className="flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 font-medium text-base group-hover:bg-neutral-100/90">
        <span className="grid h-4 w-4 shrink-0 place-items-center">
          <Image src="/File.svg" alt="" width={13} height={16} priority />
        </span>
        Scan document
      </span>
    </motion.button>
  );
}
