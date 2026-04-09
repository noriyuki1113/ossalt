import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/track";

/* ── Session key (anonymous-first) ── */

function getSessionKey(): string {
  const KEY = "ossalt_workspace_session";
  let key = localStorage.getItem(KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(KEY, key);
  }
  return key;
}

export type ToolStatus = "candidate" | "reviewing" | "on_hold" | "adopted" | "rejected";

export const STATUS_LABELS: Record<ToolStatus, string> = {
  candidate: "候補",
  reviewing: "検討中",
  on_hold: "保留",
  adopted: "採用",
  rejected: "不採用",
};

export const STATUS_COLORS: Record<ToolStatus, string> = {
  candidate: "bg-secondary text-secondary-foreground",
  reviewing: "bg-primary/10 text-primary",
  on_hold: "bg-muted text-muted-foreground",
  adopted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-destructive/10 text-destructive",
};

export interface SavedTool {
  id: string;
  session_key: string;
  tool_id: number;
  status: ToolStatus;
  personal_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComparisonList {
  id: string;
  session_key: string;
  title: string;
  summary_note: string | null;
  share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComparisonListItem {
  id: string;
  comparison_list_id: string;
  tool_id: number;
  position: number;
  decision_note: string | null;
  self_hosting_score: number | null;
  learning_curve_score: number | null;
  team_fit_score: number | null;
  custom_note: string | null;
  created_at: string;
}

/* ── Saved Tools ── */

export function useSavedTools() {
  const sessionKey = getSessionKey();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["saved-tools", sessionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_tools")
        .select("*")
        .eq("session_key", sessionKey)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as SavedTool[];
    },
  });

  const saveTool = useMutation({
    mutationFn: async (toolId: number) => {
      const { error } = await supabase
        .from("saved_tools")
        .insert({ session_key: sessionKey, tool_id: toolId });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-tools", sessionKey] });
    },
  });

  const removeTool = useMutation({
    mutationFn: async (toolId: number) => {
      const { error } = await supabase
        .from("saved_tools")
        .delete()
        .eq("session_key", sessionKey)
        .eq("tool_id", toolId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-tools", sessionKey] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ toolId, status }: { toolId: number; status: ToolStatus }) => {
      const { error } = await supabase
        .from("saved_tools")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("session_key", sessionKey)
        .eq("tool_id", toolId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-tools", sessionKey] });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ toolId, note }: { toolId: number; note: string }) => {
      const { error } = await supabase
        .from("saved_tools")
        .update({ personal_note: note, updated_at: new Date().toISOString() })
        .eq("session_key", sessionKey)
        .eq("tool_id", toolId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-tools", sessionKey] });
    },
  });

  const isToolSaved = useCallback(
    (toolId: number) => query.data?.some((s) => s.tool_id === toolId) ?? false,
    [query.data]
  );

  return {
    savedTools: query.data || [],
    isLoading: query.isLoading,
    saveTool,
    removeTool,
    updateStatus,
    updateNote,
    isToolSaved,
  };
}

/* ── Comparison Lists ── */

export function useComparisonLists() {
  const sessionKey = getSessionKey();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["comparison-lists", sessionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comparison_lists")
        .select("*")
        .eq("session_key", sessionKey)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ComparisonList[];
    },
  });

  const createList = useMutation({
    mutationFn: async (title?: string) => {
      const { data, error } = await supabase
        .from("comparison_lists")
        .insert({ session_key: sessionKey, title: title || "無題の比較" })
        .select()
        .single();
      if (error) throw error;
      return data as ComparisonList;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-lists", sessionKey] });
    },
  });

  const deleteList = useMutation({
    mutationFn: async (listId: string) => {
      const { error } = await supabase
        .from("comparison_lists")
        .delete()
        .eq("id", listId)
        .eq("session_key", sessionKey);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-lists", sessionKey] });
    },
  });

  const updateList = useMutation({
    mutationFn: async ({ id, title, summaryNote }: { id: string; title?: string; summaryNote?: string }) => {
      const updates: { updated_at: string; title?: string; summary_note?: string } = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title;
      if (summaryNote !== undefined) updates.summary_note = summaryNote;
      const { error } = await supabase
        .from("comparison_lists")
        .update(updates)
        .eq("id", id)
        .eq("session_key", sessionKey);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-lists", sessionKey] });
    },
  });

  const generateShareToken = useMutation({
    mutationFn: async (listId: string) => {
      const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const { error } = await supabase
        .from("comparison_lists")
        .update({ share_token: token, updated_at: new Date().toISOString() })
        .eq("id", listId)
        .eq("session_key", sessionKey);
      if (error) throw error;
      track("share_link_created", { list_id: listId });
      return token;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-lists", sessionKey] });
    },
  });

  return {
    lists: query.data || [],
    isLoading: query.isLoading,
    createList,
    deleteList,
    updateList,
    generateShareToken,
  };
}

/* ── Comparison List Items ── */

export function useComparisonItems(listId: string | undefined) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["comparison-items", listId],
    queryFn: async () => {
      if (!listId) return [];
      const { data, error } = await supabase
        .from("comparison_list_items")
        .select("*")
        .eq("comparison_list_id", listId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data || []) as ComparisonListItem[];
    },
    enabled: !!listId,
  });

  const addItem = useMutation({
    mutationFn: async ({ toolId, position }: { toolId: number; position?: number }) => {
      if (!listId) throw new Error("No list ID");
      const { error } = await supabase
        .from("comparison_list_items")
        .insert({
          comparison_list_id: listId,
          tool_id: toolId,
          position: position ?? (query.data?.length ?? 0),
        });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-items", listId] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("comparison_list_items")
        .delete()
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-items", listId] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ itemId, updates }: {
      itemId: string;
      updates: Partial<Pick<ComparisonListItem, "decision_note" | "self_hosting_score" | "learning_curve_score" | "team_fit_score" | "custom_note">>;
    }) => {
      const { error } = await supabase
        .from("comparison_list_items")
        .update(updates)
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comparison-items", listId] });
    },
  });

  return {
    items: query.data || [],
    isLoading: query.isLoading,
    addItem,
    removeItem,
    updateItem,
  };
}

/* ── Shared comparison (public read) ── */

export function useSharedComparison(shareToken: string | undefined) {
  return useQuery({
    queryKey: ["shared-comparison", shareToken],
    queryFn: async () => {
      if (!shareToken) return null;
      const { data: list, error } = await supabase
        .from("comparison_lists")
        .select("*")
        .eq("share_token", shareToken)
        .single();
      if (error) throw error;

      const { data: items, error: itemsError } = await supabase
        .from("comparison_list_items")
        .select("*")
        .eq("comparison_list_id", list.id)
        .order("position", { ascending: true });
      if (itemsError) throw itemsError;

      return {
        list: list as ComparisonList,
        items: (items || []) as ComparisonListItem[],
      };
    },
    enabled: !!shareToken,
  });
}

export { getSessionKey };
