import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <Card className="rounded-lg border-black/10 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Icon className="size-5 text-[#14756b]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-6 text-[#625d54]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#14756b]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
