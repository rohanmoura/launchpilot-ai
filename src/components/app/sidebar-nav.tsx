"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, Library, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/create",
    label: "Create",
    icon: Plus,
  },
  {
    href: "/blueprints",
    label: "Blueprints",
    icon: Library,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-black/10 bg-[#11100f] text-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid size-9 place-items-center rounded-md bg-[#d6ff72] text-sm font-semibold text-[#1f2a0d]">
          LP
        </span>
        <div>
          <p className="font-semibold">LaunchPilot AI</p>
          <p className="text-xs text-white/45">MVP planner</p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/62 transition hover:bg-white/10 hover:text-white",
                isActive && "bg-white text-[#11100f] hover:bg-white hover:text-[#11100f]",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden px-4 lg:block">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
          <ClipboardList className="size-5 text-[#d6ff72]" />
          <p className="mt-4 text-sm font-semibold">Free workspace</p>
          <p className="mt-2 text-sm leading-6 text-white/50">
            3 blueprint credits included for the portfolio MVP flow.
          </p>
        </div>
      </div>
    </aside>
  );
}
