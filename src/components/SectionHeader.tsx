import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, className = "", children }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      {children}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
