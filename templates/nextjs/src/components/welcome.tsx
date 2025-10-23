import { cn } from "@/utils/cn";
import Image from "next/image";
import nextSvg from "@/components/next.svg";
import vercelSvg from "@/components/vercel.svg";
import fileSvg from "@/components/file.svg";
import globeSvg from "@/components/globe.svg";
import windowSvg from "@/components/window.svg";

export default function Welcome() {
  return (
    <div
      className={cn(
        `grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20`
      )}
    >
      <main
        className={cn(
          `row-start-2 flex flex-col items-center gap-[32px] sm:items-start`
        )}
      >
        <Image
          className={cn(`invert`)}
          src={nextSvg}
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol
          className={cn(
            `list-inside list-decimal text-center font-mono text-sm/6 sm:text-left`
          )}
        >
          <li className={cn(`mb-2 tracking-[-.01em]`)}>
            Get started by editing{" "}
            <code
              className={cn(
                `rounded bg-white/5 px-1 py-0.5 font-mono font-semibold`
              )}
            >
              src/components/welcome.tsx
            </code>
            .
          </li>
          <li className={cn(`tracking-[-.01em]`)}>
            Save and see your changes instantly.
          </li>
        </ol>

        <div className={cn(`flex flex-col items-center gap-4 sm:flex-row`)}>
          <a
            className={cn(
              `flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-white/5 px-4 text-sm font-medium transition-colors hover:bg-white/10 sm:h-12 sm:w-auto sm:px-5 sm:text-base`
            )}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={vercelSvg}
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className={cn(
              `flex h-10 w-full items-center justify-center rounded-full border border-solid border-white/10 px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-white/10 sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px]`
            )}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer
        className={cn(
          `row-start-3 flex flex-wrap items-center justify-center gap-[24px]`
        )}
      >
        <a
          className={cn(
            `flex items-center gap-2 hover:underline hover:underline-offset-4`
          )}
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src={fileSvg}
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className={cn(
            `flex items-center gap-2 hover:underline hover:underline-offset-4`
          )}
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src={windowSvg}
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className={cn(
            `flex items-center gap-2 hover:underline hover:underline-offset-4`
          )}
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src={globeSvg}
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
