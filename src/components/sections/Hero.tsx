import { Reveal } from "@/components/system/Reveal";
import { HeroClock, CopyEmail } from "@/components/sections/HeroWidgets";
import { HeroScene } from "@/components/sections/HeroScene";
import { HeadlineToolkit } from "@/components/sections/HeadlineToolkit";

/**
 * Soft iridescent backdrop: layered pastel conic/radial discs, blurred, under
 * a pearl veil so the ink headline keeps full contrast. Pure CSS, no assets.
 */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#F6F3EF_0%,#F1EDF6_45%,#EFEFF3_100%)]" />
      <div className="absolute -top-[18%] right-[-8%] aspect-square h-[70%] rounded-full bg-[conic-gradient(from_210deg,#FFD9C9,#E6D9FF_30%,#C9E8FF_55%,#D9FFE9_75%,#FFD9C9)] opacity-70 blur-3xl" />
      <div className="absolute left-[-10%] top-[30%] aspect-square h-[55%] rounded-full bg-[conic-gradient(from_40deg,#C9E8FF,#FFE3D9_35%,#EAD9FF_65%,#C9E8FF)] opacity-60 blur-3xl" />
      <div className="absolute bottom-[-25%] left-[35%] aspect-square h-[60%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFE9D9_0%,#E0D9FF_45%,transparent_70%)] opacity-50 blur-3xl" />
      <div className="absolute inset-0 bg-white/25" />
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-paper p-2">
      <div className="relative flex min-h-[max(calc(100dvh-16px),640px)] flex-col overflow-hidden rounded-card bg-paper px-4 pb-8 pt-[112px] tab:rounded-hero tab:px-6 desk:px-16">
        <HeroBackdrop />
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
          <HeroScene />
        </div>

        <div className="relative z-[1] flex flex-1 flex-col items-center justify-center">
          <HeadlineToolkit />
        </div>

        <div className="relative z-[1] mt-12 flex flex-col items-center gap-6 desk:grid desk:grid-cols-3 desk:items-end">
          <Reveal mode="mount" delay={0.24} className="order-2 desk:order-none desk:justify-self-start">
            <HeroClock />
          </Reveal>
          <Reveal mode="mount" delay={0.16} className="order-1 desk:order-none desk:justify-self-center">
            <p className="o-body max-w-md text-center">
              Design, engineering, conversion science, and practical AI, working as one system to
              grow your Shopify store.
            </p>
          </Reveal>
          <Reveal mode="mount" delay={0.24} className="order-3 desk:order-none desk:justify-self-end">
            <CopyEmail />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
