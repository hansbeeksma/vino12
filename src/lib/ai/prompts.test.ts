import { describe, it, expect } from "vitest";
import {
  CLASSIFIER_SYSTEM_PROMPT,
  RESEARCHER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
} from "./prompts";

describe("AI prompts", () => {
  describe("CLASSIFIER_SYSTEM_PROMPT", () => {
    it("references VINO12", () => {
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("VINO12");
    });

    it("defines all required JSON fields", () => {
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain('"title"');
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain('"summary"');
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain('"category"');
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain('"urgency"');
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain('"complexity"');
    });

    it("defines all categories", () => {
      const categories = [
        "product",
        "marketing",
        "operations",
        "tech",
        "content",
        "design",
        "other",
      ];
      for (const cat of categories) {
        expect(CLASSIFIER_SYSTEM_PROMPT).toContain(cat);
      }
    });

    it("defines urgency levels", () => {
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("low");
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("medium");
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("high");
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("urgent");
    });

    it("instructs to respond with valid JSON only", () => {
      expect(CLASSIFIER_SYSTEM_PROMPT).toContain("ALLEEN met valid JSON");
    });
  });

  describe("RESEARCHER_SYSTEM_PROMPT", () => {
    it("references VINO12", () => {
      expect(RESEARCHER_SYSTEM_PROMPT).toContain("VINO12");
    });

    it("defines all required JSON fields", () => {
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"competitors"');
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"trends"');
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"best_practices"');
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"risks"');
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"opportunities"');
      expect(RESEARCHER_SYSTEM_PROMPT).toContain('"sources"');
    });

    it("asks about concurrenten", () => {
      expect(RESEARCHER_SYSTEM_PROMPT).toContain("concurrenten");
    });
  });

  describe("PLANNER_SYSTEM_PROMPT", () => {
    it("references VINO12", () => {
      expect(PLANNER_SYSTEM_PROMPT).toContain("VINO12");
    });

    it("includes SWOT analysis structure", () => {
      expect(PLANNER_SYSTEM_PROMPT).toContain('"swot"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"strengths"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"weaknesses"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"opportunities"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"threats"');
    });

    it("includes feasibility scoring", () => {
      expect(PLANNER_SYSTEM_PROMPT).toContain('"feasibility_score"');
    });

    it("defines effort sizes from XS to XL", () => {
      const sizes = ["XS", "S", "M", "L", "XL"];
      for (const size of sizes) {
        expect(PLANNER_SYSTEM_PROMPT).toContain(size);
      }
    });

    it("includes action plan with required fields", () => {
      expect(PLANNER_SYSTEM_PROMPT).toContain('"action_plan"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"steps"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"quick_wins"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"dependencies"');
      expect(PLANNER_SYSTEM_PROMPT).toContain('"success_metrics"');
    });
  });
});
