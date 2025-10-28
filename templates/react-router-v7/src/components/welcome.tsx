import { Link } from "@/lib/link";
import { cn } from "@/utils/cn";

export default function Welcome() {
  return (
    <div
      className={cn(
        `grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20`
      )}
    >
      <main
        className={cn(
          `row-start-2 flex flex-col items-center gap-8 sm:items-start`
        )}
      >
        <img
          className={cn(``)}
          src={"/react-router-logo.svg"}
          alt="React router logo"
          width={180}
          height={38}
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
          <Link
            className={cn(
              `flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-white/5 px-4 text-sm font-medium transition-colors hover:bg-white/10 sm:h-12 sm:w-auto sm:px-5 sm:text-base`
            )}
            href="https://reactrouter.com/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy now
          </Link>
          <Link
            className={cn(
              `flex h-10 w-full items-center justify-center rounded-full border border-solid border-white/10 px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-white/10 sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px]`
            )}
            href="https://reactrouter.com/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </Link>
        </div>
      </main>
    </div>
  );
}
