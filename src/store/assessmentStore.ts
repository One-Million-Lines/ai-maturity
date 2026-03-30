import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answers, AnswerValue, AssessmentResult, SessionState } from "@/types/assessment";
import { computeAssessmentResults } from "@/engine/scoringEngine";
import questionsConfig from "@/config/questions.json";

interface AssessmentStore {
  session: SessionState;
  answers: Answers;
  results: AssessmentResult | null;

  // Actions
  setAnswer: (questionId: string, value: AnswerValue) => void;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  completeAssessment: () => void;
  computeResults: () => void;
  resetAssessment: () => void;

  // Derived
  getSectionQuestions: (sectionId: string) => typeof questionsConfig.questions;
  getSectionProgress: () => { current: number; total: number; percentage: number };
  isSectionComplete: (sectionId: string) => boolean;
  isAssessmentComplete: () => boolean;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      session: {
        startedAt: "",
        lastUpdatedAt: "",
        currentSectionIndex: 0,
        completed: false,
      },
      answers: {},
      results: null,

      setAnswer: (questionId, value) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
          session: {
            ...state.session,
            lastUpdatedAt: new Date().toISOString(),
            startedAt: state.session.startedAt || new Date().toISOString(),
          },
        }));
      },

      goToSection: (index) => {
        set((state) => ({
          session: { ...state.session, currentSectionIndex: index },
        }));
      },

      nextSection: () => {
        const sections = questionsConfig.sections;
        set((state) => ({
          session: {
            ...state.session,
            currentSectionIndex: Math.min(state.session.currentSectionIndex + 1, sections.length - 1),
          },
        }));
      },

      prevSection: () => {
        set((state) => ({
          session: {
            ...state.session,
            currentSectionIndex: Math.max(state.session.currentSectionIndex - 1, 0),
          },
        }));
      },

      completeAssessment: () => {
        const results = computeAssessmentResults(get().answers);
        set((state) => ({
          session: { ...state.session, completed: true },
          results,
        }));
      },

      computeResults: () => {
        const results = computeAssessmentResults(get().answers);
        set({ results });
      },

      resetAssessment: () => {
        set({
          session: { startedAt: "", lastUpdatedAt: "", currentSectionIndex: 0, completed: false },
          answers: {},
          results: null,
        });
      },

      getSectionQuestions: (sectionId) => {
        return questionsConfig.questions.filter((q) => q.sectionId === sectionId);
      },

      getSectionProgress: () => {
        const total = questionsConfig.sections.length;
        const current = get().session.currentSectionIndex;
        return { current, total, percentage: Math.round(((current + 1) / total) * 100) };
      },

      isSectionComplete: (sectionId) => {
        const answers = get().answers;
        const questions = questionsConfig.questions.filter((q) => q.sectionId === sectionId);
        return questions.filter((q) => q.required).every((q) => {
          const ans = answers[q.id];
          if (ans == null) return false;
          if (Array.isArray(ans) && ans.length === 0) return false;
          return true;
        });
      },

      isAssessmentComplete: () => {
        const answers = get().answers;
        const requiredQuestions = questionsConfig.questions.filter((q) => q.required);
        return requiredQuestions.every((q) => {
          const ans = answers[q.id];
          if (ans == null) return false;
          if (Array.isArray(ans) && ans.length === 0) return false;
          return true;
        });
      },
    }),
    {
      name: "ai-maturity-assessment",
    }
  )
);
