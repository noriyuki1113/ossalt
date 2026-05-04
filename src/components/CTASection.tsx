import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  subtitle?: string;
  note?: string;
  buttonText: string;
  buttonTo: string;
}

export function CTASection({ title, subtitle, note, buttonText, buttonTo }: CTASectionProps) {
  return (
    <section className="container py-16 md:py-24 px-4">
      <div className="card-unified p-7 md:p-14 text-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-2 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {note && (
          <p className="text-xs text-muted-foreground/80 mb-8 max-w-md mx-auto leading-relaxed">
            {note}
          </p>
        )}
        <Button asChild size="lg" className="rounded-xl px-8">
          <Link to={buttonTo}>
            {buttonText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
