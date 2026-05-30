import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { WorkspaceBadge } from "@/components/app/workspace-badge";

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AppShell({ eyebrow, title, description, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#191816] lg:flex">
      <SidebarNav />
      <section className="min-w-0 flex-1">
        <header className="border-b border-black/10 bg-white/82 px-5 py-5 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase text-[#14756b]">
                  {eyebrow}
                </p>
                <WorkspaceBadge />
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl leading-7 text-[#625d54]">
                {description}
              </p>
            </div>
            <Button asChild className="h-10 rounded-md bg-[#191816] text-white">
              <Link href="/create">
                New Blueprint
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">{children}</div>
      </section>
    </main>
  );
}
