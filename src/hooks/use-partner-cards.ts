import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PartnerCard {
  id: string;
  tool_slug_or_category: string | null;
  partner_name: string;
  partner_type: string;
  label: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
  priority: number;
  active: boolean;
}

export function usePartnerCards(toolId: number, toolName: string | null) {
  const toolSlug = toolName
    ? toolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "";

  return useQuery({
    queryKey: ["partner-cards", toolId],
    queryFn: async () => {
      const identifiers: string[] = [String(toolId)];
      if (toolSlug) identifiers.push(toolSlug);

      const { data, error } = await supabase
        .from("partner_cards")
        .select("*")
        .in("tool_slug_or_category", identifiers)
        .eq("active", true)
        .order("priority", { ascending: false });

      if (error) throw error;
      return (data as PartnerCard[]) || [];
    },
    enabled: !!toolId,
    staleTime: 1000 * 60 * 10,
  });
}
