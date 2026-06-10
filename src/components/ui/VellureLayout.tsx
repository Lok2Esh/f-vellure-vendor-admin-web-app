import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VellureCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'elevated' | 'flat' | 'outline';
}

export function VellureCard({ children, className, variant = 'elevated' }: VellureCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 transition-all",
      variant === 'elevated' && "shadow-lg shadow-burgundy/5 border border-gray-100/50 hover:shadow-xl hover:shadow-burgundy/10",
      variant === 'flat' && "bg-gray-50/50",
      variant === 'outline' && "border border-burgundy/20 bg-transparent",
      className
    )}>
      {children}
    </div>
  );
}

interface VellureSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function VellureSection({ title, subtitle, children, className }: VellureSectionProps) {
  return (
    <section className={cn("space-y-6 py-4", className)}>
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
