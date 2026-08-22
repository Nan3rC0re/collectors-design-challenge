import type { ReactNode } from "react";
import { ImageIcon, PlayCircle } from "lucide-react";
import Image from "next/image";
import ScanButton from "@/components/ScanButton";
import TapButton from "@/components/TapButton";
import LoopButton from "@/components/LoopButton";
import ScannedLoopButton from "@/components/ConfirmedLoopButton";

function DemoCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white">
      {children}
    </div>
  );
}

function ImageSlot({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
      <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function VideoSlot({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
      <PlayCircle className="h-5 w-5" strokeWidth={1.5} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full flex-1 flex justify-center px-6 py-20">
      <article className="w-full max-w-2xl">
        <header className="mb-12">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Scan Button Interaction
          </h1>
          <p className="mt-1 text-sm text-neutral-400">by Nana Kofi Okae</p>
        </header>
        <section className="mb-10">
          The user who does mundane tasks now has the opportunity to get pockets
          of delight in their day-to-day document scanning. Let&apos;s go on a
          deep dive into my thought process for this interaction.
        </section>
        <section className="mb-10">
          The foundation for designing this delightful experience for a
          not-so-delightful task focused on feedback:{" "}
          <span className="font-bold">interactivity</span>,{" "}
          <span className="font-bold">visuals</span>, and{" "}
          <span className="font-bold">sound</span>.
        </section>
        <section className="mb-10">
          <DemoCard>
            <ScanButton />
          </DemoCard>
        </section>

        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Visual</h2>
        <section className="mb-8">
          I wanted to ensure the button states were effective at giving the user
          feedback without sacrificing speed, so I kept the experience down to 4
          states.
        </section>
        <section className="mb-10">
          <Image
            src="/button-state-flow.png"
            priority
            alt="states of buttons"
            width={1000}
            height={300}
            className="w-full rounded-2xl border border-neutral-200"
          />
        </section>
        <section className="mb-10">
          Ensuring that the same color{" "}
          <span className="font-bold text-sky-400">(text-sky-400)</span> for
          icons (Lucide React) are used as a cue for what is currently happening
          in the scanning process.
        </section>
        <section className="mb-10">
          <DemoCard>
            <LoopButton />
            <ScannedLoopButton />
          </DemoCard>
        </section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          Interactivity
        </h2>
        <section className="mb-10">
          For the button interaction, I focused on how the animation can have a
          reminiscence of the real world. When the button is clicked or pressed,
          it scales down to{" "}
          <span className="font-bold text-pink-400">92% </span> of its original
          size and stays in that state until all documents are scanned. When we
          complete scanning, we animate back into its original size with a
          subtle spring animation. For accessibility, I included a clickable
          area of <span className="font-bold text-pink-400">16px</span>, giving
          users more room to land a tap without needing the button to look
          bigger.
        </section>
        <section className="mb-10">
          <DemoCard>
            <TapButton />
          </DemoCard>
        </section>
        <section className="mb-16">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">Sound</h2>
          <p className=" leading-relaxed">
            The best part of this process was spending a couple of minutes on
            Pixabay searching for royalty-free sound effects, building auditory
            feedback that feels like it&apos;s meant to be there and not a
            novelty.
          </p>
        </section>
        <section className="mb-8">
          Some iterations of confirmed states. I wanted to include a shimmer for
          more delight, but ultimately decided to keep it simple.
        </section>
        <section className="mb-16">
          <Image
            src="/confirmed-iterations.png"
            alt="iterations"
            priority
            width={1000}
            height={300}
            className="w-full rounded-2xl border border-neutral-200"
          />
        </section>
        <section className="mb-8">
          I really enjoyed designing and building this. If I had time, another
          form of feedback I would have liked to incorporate would be haptic
          feedback for mobile users.
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            Sources
          </h2>
          <ul className="space-y-1 text-neutral-500">
            <li>
              <a
                href="https://www.figma.com/design/haguegfiow90IC5Cb4cvtf/Untitled?node-id=0-1&t=rVoCj8Q9Eef0eb60-1"
                target="_blank"
                className="underline hover:text-neutral-700"
              >
                Figma file
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Nan3rC0re/collectors-design-challenge"
                target="_blank"
                className="underline hover:text-neutral-700"
              >
                GitHub repo
              </a>
            </li>
            <li>
              <a
                href="https://pixabay.com/sound-effects/search/success/"
                target="_blank"
                className="underline hover:text-neutral-700"
              >
                Sound effects
              </a>
            </li>
            <li>
              <a
                href="https://www.loom.com/share/a85ba758bf2e48adaf2f4a74ab2cac59"
                target="_blank"
                className="underline hover:text-neutral-700"
              >
                Loom Video
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            How I used AI
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-neutral-500 leading-relaxed">
            <li>
              I utilized Claude to help create different variations for the
              write-up.
            </li>
            <li>
              Helped with unifying state animations and removing redundant code.
            </li>
            <li>The sound feedback cues for the interaction.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
