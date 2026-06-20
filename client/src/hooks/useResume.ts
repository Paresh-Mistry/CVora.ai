// src/hooks/useResume.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { resumeApi, CreateResumePayload, UpdateResumePayload } from "../services/resume.services";
import { queryKeys } from "../lib/queryKeys";

// ── List all resumes ──────────────────────────────────────────────────────────

export function useResumes() {
  return useQuery({
    queryKey: queryKeys.resumes(),
    queryFn:  resumeApi.list,
    staleTime: 30 * 1000,   // 30 s
  });
}

// ── Single resume ─────────────────────────────────────────────────────────────

export function useResume(id: string) {
  return useQuery({
    queryKey: queryKeys.resume(id),
    queryFn:  () => resumeApi.get(id),
    enabled:  !!id,
    staleTime: 30 * 1000,
  });
}

// ── Create ────────────────────────────────────────────────────────────────────

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResumePayload) => resumeApi.create(payload),

    onSuccess: (newResume) => {
      // Add to list cache immediately — no refetch needed
      queryClient.setQueryData(queryKeys.resumes(), (old: any[] = []) => [newResume, ...old]);
      // Pre-populate single resume cache
      queryClient.setQueryData(queryKeys.resume(newResume.id), newResume);
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateResume(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateResumePayload) => resumeApi.update(id, payload),

    // Optimistic update — UI feels instant
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.resume(id) });
      const previous = queryClient.getQueryData(queryKeys.resume(id));
      queryClient.setQueryData(queryKeys.resume(id), (old: any) => ({
        ...old,
        ...payload,
        data: { ...old?.data, ...payload.data },
      }));
      return { previous };
    },

    onError: (_err, _payload, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.resume(id), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resume(id) });
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),

    onSuccess: (_data, id) => {
      queryClient.setQueryData(queryKeys.resumes(), (old: any[] = []) =>
        old.filter((r) => r.id !== id)
      );
      queryClient.removeQueries({ queryKey: queryKeys.resume(id) });
    },
  });
}

// ── Autosave (debounced) ──────────────────────────────────────────────────────
// Use this in the builder so every keystroke doesn't fire a request.

export function useAutosave(resumeId: string, delayMs = 1500) {
  const { mutate } = useUpdateResume(resumeId);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (payload: UpdateResumePayload) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => mutate(payload), delayMs);
    },
    [mutate, delayMs]
  );

  return save;
}