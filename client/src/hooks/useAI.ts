// src/hooks/useAI.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  aiApi,
  AIGeneratePayload,
  ATSPayload,
  CoverLetterPayload,
  creditsApi,
  jobsApi,
  templateApi,
} from "../services/ai.services";
import { queryKeys } from "../lib/queryKeys";

// ── Templates ─────────────────────────────────────────────────────────────────

// src/hooks/useAI.ts
export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates(),
    queryFn:  templateApi.list,
    staleTime: 5 * 60 * 1000,   // ← change from Infinity to 5 min
    gcTime: 10 * 60 * 1000,     // keep in cache 10 min
    retry: 2,
    refetchOnMount: true,        // ← always refetch on mount
    refetchOnWindowFocus: false,
  });
}

// ── Credits ───────────────────────────────────────────────────────────────────

export function useCredits() {
  return useQuery({
    queryKey: queryKeys.credits(),
    queryFn:  creditsApi.get,
    staleTime: 10 * 1000,   // 10 s — refresh after mutations
  });
}

// ── AI generate ───────────────────────────────────────────────────────────────

export function useAIGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AIGeneratePayload) => aiApi.generate(payload),

    onSuccess: (result, variables) => {
      // Update the resume in cache with the new insight
      queryClient.setQueryData(queryKeys.resume(variables.resume_id), (old: any) =>
        old ? { ...old, insight: result.insight } : old
      );
      // Refresh credit count shown in the UI
      queryClient.invalidateQueries({ queryKey: queryKeys.credits() });
    },
  });
}

// ── ATS score ─────────────────────────────────────────────────────────────────

export function useATSScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ATSPayload) => aiApi.ats(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credits() });
    },
  });
}

// ── Cover letter ──────────────────────────────────────────────────────────────

export function useCoverLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CoverLetterPayload) => aiApi.coverLetter(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.credits() });
    },
  });
}


// ── Job search (premium) ──────────────────────────────────────────────────────

export function useJobSearch(resumeId: string) {
  return useQuery({
    queryKey: queryKeys.jobs(resumeId),
    queryFn:  () => jobsApi.search(resumeId),
    enabled:  !!resumeId,
    staleTime: 5 * 60 * 1000,   // 5 min — job listings don't change that fast
  });
}