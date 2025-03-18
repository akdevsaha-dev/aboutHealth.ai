
import { Navbar } from "@/components/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { projects } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <BackgroundLines className="flex md:pt-0 pt-15 items-center justify-center w-full flex-col px-4 relative z-20">
        <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
          Your Intelligent AI Assistant, <br /> for <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-600 bg-clip-text text-transparent">Everything.</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
          Experience the power of AI with our advanced assistant. Get answers, create content, and solve problems instantly.
        </p>
        <div className="h-auto w-full flex justify-center text-white gap-8 pt-8">
          <Link href={"/about"}>
            <div className="relative px-2 md:px-8 h-10 rounded-md font-medium text-sm md:text-md bg-white text-black flex flex-row items-center gap-3">
              Try it now
              <MoveRight size={20} />
            </div>
          </Link>
          <Link href={"/about"}>
            <button className="relative inline-flex h-10  overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="md:px-8 px-2 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 py-1 text-sm md:text-md font-medium text-white backdrop-blur-3xl">
                Learn more
              </span>
            </button>
          </Link>
        </div>
      </BackgroundLines>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Unleash the power of <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none 
  bg-gradient-to-b from-stone-300 via-stone-500 to-gray-700 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={"/heroCover.jpg"}
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
      <div className="h-[30rem] w-full bg-[black]">
      <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
      </div>
    </div>
  );
}
