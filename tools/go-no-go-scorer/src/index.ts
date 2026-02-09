#!/usr/bin/env node

import { prompt } from "enquirer";
import chalk from "chalk";
import { writeFileSync } from "fs";
import { join } from "path";
import { CRITERIA } from "./criteria.js";
import type {
  CriterionScore,
  ValidationResult,
  Decision,
  ThresholdCheck,
  RiskAnalysis,
} from "./types.js";

async function main() {
  console.clear();
  console.log(
    chalk.bold.cyan("\n╔════════════════════════════════════════════╗"),
  );
  console.log(chalk.bold.cyan("║  VINO12 Go/No-Go Decision Scorer v1.0     ║"));
  console.log(
    chalk.bold.cyan("╚════════════════════════════════════════════╝\n"),
  );

  console.log(
    chalk.white(
      "Dit tool leidt je door de 8 criteria van het Go/No-Go framework.\n",
    ),
  );
  console.log(
    chalk.gray("Voor elk criterium geef je een score (0-5) en rationale.\n"),
  );

  const scores: CriterionScore[] = [];

  for (const criterion of CRITERIA) {
    console.log(chalk.bold.yellow(`\n━━━ Criterium ${criterion.id}/8 ━━━`));
    console.log(chalk.bold.white(criterion.name));
    console.log(chalk.gray(`Gewicht: ${criterion.weight}%`));
    console.log(chalk.gray(criterion.description));

    if (criterion.minimumThreshold) {
      console.log(
        chalk.red(`⚠️  Minimum threshold: ≥${criterion.minimumThreshold}`),
      );
    }

    console.log(chalk.cyan("\nScoring Guide:"));
    criterion.scoringGuide.forEach((level) => {
      const color =
        level.score >= 4
          ? chalk.green
          : level.score >= 3
            ? chalk.yellow
            : chalk.red;
      console.log(
        color(`  ${level.score} - ${level.label}: ${level.description}`),
      );
    });

    const response = await prompt<{
      score: number;
      rationale: string;
      dataSource: string;
      confidenceLevel: "Hoog" | "Medium" | "Laag";
      keyFindings: string;
    }>([
      {
        type: "numeral",
        name: "score",
        message: `Score voor ${criterion.name} (0-5):`,
        validate: (value) =>
          value >= 0 && value <= 5 ? true : "Score moet tussen 0 en 5 zijn",
      },
      {
        type: "input",
        name: "rationale",
        message: "Rationale (waarom deze score?):",
        validate: (value) => (value.length > 10 ? true : "Geef meer context"),
      },
      {
        type: "input",
        name: "dataSource",
        message: "Data source(s):",
        initial: "JTBD interviews, surveys, tests",
      },
      {
        type: "select",
        name: "confidenceLevel",
        message: "Confidence level in deze score:",
        choices: ["Hoog", "Medium", "Laag"],
      },
      {
        type: "input",
        name: "keyFindings",
        message: "Key findings (comma-separated):",
        validate: (value) => (value.length > 5 ? true : "Geef key findings"),
      },
    ]);

    scores.push({
      criterionId: criterion.id,
      score: response.score,
      rationale: response.rationale,
      dataSource: response.dataSource,
      confidenceLevel: response.confidenceLevel,
      keyFindings: response.keyFindings.split(",").map((f) => f.trim()),
    });

    // Show weighted score
    const weightedScore = (response.score * criterion.weight) / 100;
    console.log(
      chalk.green(
        `\n✓ Gewogen score: ${weightedScore.toFixed(2)} (${response.score} × ${criterion.weight}%)`,
      ),
    );

    // Check threshold
    if (
      criterion.minimumThreshold &&
      response.score < criterion.minimumThreshold
    ) {
      console.log(
        chalk.red(
          `⚠️  WAARSCHUWING: Score onder minimum threshold (${criterion.minimumThreshold})`,
        ),
      );
    }
  }

  // Calculate results
  const result = calculateValidationResult(scores);

  // Display summary
  console.log(
    chalk.bold.cyan("\n\n╔════════════════════════════════════════════╗"),
  );
  console.log(
    chalk.bold.cyan("║            RESULTATEN                      ║"),
  );
  console.log(
    chalk.bold.cyan("╚════════════════════════════════════════════╝\n"),
  );

  console.log(
    chalk.bold.white(`Totale Score: ${result.totalScore.toFixed(2)} / 5.0`),
  );
  console.log(
    getDecisionColor(result.decision)(`Beslissing: ${result.decision}`),
  );

  console.log(chalk.bold.yellow("\n━━━ Threshold Checks ━━━"));
  result.thresholdChecks.forEach((check) => {
    const icon = check.passed ? chalk.green("✓") : chalk.red("✗");
    console.log(
      `${icon} ${check.criterion}: ${check.actual} ${check.passed ? "≥" : "<"} ${check.required}`,
    );
  });

  const allPassed = result.thresholdChecks.every((c) => c.passed);
  if (!allPassed) {
    console.log(
      chalk.red(
        "\n⚠️  HARD BLOCKER: Niet alle thresholds zijn gehaald → Automatische NO-GO",
      ),
    );
  }

  console.log(chalk.bold.yellow("\n━━━ Risico Analyse ━━━"));
  console.log(
    chalk.red(`Hoog Risico: ${result.riskAnalysis.highRisk.length} criteria`),
  );
  console.log(
    chalk.yellow(
      `Medium Risico: ${result.riskAnalysis.mediumRisk.length} criteria`,
    ),
  );
  console.log(
    chalk.green(
      `Laag Risico/Sterk: ${result.riskAnalysis.lowRisk.length} criteria`,
    ),
  );

  // Save results
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const outputPath = join(process.cwd(), `go-no-go-result-${timestamp}.json`);
  writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(chalk.green(`\n✓ Resultaten opgeslagen: ${outputPath}`));

  // Generate report
  console.log(chalk.cyan("\n━━━ Volgende Stappen ━━━"));
  console.log(chalk.white("1. Review de resultaten in het JSON bestand"));
  console.log(
    chalk.white(
      "2. Vul de validation report template in (templates/validation-report.md)",
    ),
  );
  console.log(
    chalk.white("3. Presenteer aan stakeholders voor finale beslissing"),
  );

  if (result.decision.includes("GO") && !result.decision.includes("NO")) {
    console.log(chalk.white("4. Werk 90-dagen plan uit (zie framework)"));
  } else {
    console.log(chalk.white("4. Overweeg pivot of stop beslissing"));
  }

  console.log();
}

function calculateValidationResult(scores: CriterionScore[]): ValidationResult {
  // Calculate weighted total
  let totalWeightedScore = 0;
  scores.forEach((score) => {
    const criterion = CRITERIA.find((c) => c.id === score.criterionId)!;
    totalWeightedScore += (score.score * criterion.weight) / 100;
  });

  // Check thresholds
  const thresholdChecks: ThresholdCheck[] = [];

  // Problem Validation threshold
  const problemScore = scores.find((s) => s.criterionId === 1)!;
  thresholdChecks.push({
    criterion: "Problem Validation",
    required: "≥3.0",
    actual: problemScore.score,
    passed: problemScore.score >= 3,
  });

  // Willingness to Pay threshold
  const wtpScore = scores.find((s) => s.criterionId === 2)!;
  thresholdChecks.push({
    criterion: "Willingness to Pay",
    required: "≥2.0",
    actual: wtpScore.score,
    passed: wtpScore.score >= 2,
  });

  // Market Size threshold (assuming score 3 = €500K minimum)
  const somScore = scores.find((s) => s.criterionId === 3)!;
  thresholdChecks.push({
    criterion: "Market Size (SOM)",
    required: ">€500K",
    actual: somScore.score,
    passed: somScore.score >= 3,
  });

  const passedThresholds = thresholdChecks.every((c) => c.passed);

  // Determine decision
  let decision: Decision;
  if (!passedThresholds) {
    decision = "STRONG NO-GO";
  } else if (totalWeightedScore >= 4.0) {
    decision = "STRONG GO";
  } else if (totalWeightedScore >= 3.5) {
    decision = "GO";
  } else if (totalWeightedScore >= 3.0) {
    decision = "CONDITIONAL GO";
  } else if (totalWeightedScore >= 2.5) {
    decision = "NO-GO";
  } else {
    decision = "STRONG NO-GO";
  }

  // Risk analysis
  const riskAnalysis: RiskAnalysis = {
    highRisk: [],
    mediumRisk: [],
    lowRisk: [],
  };

  scores.forEach((score) => {
    const criterion = CRITERIA.find((c) => c.id === score.criterionId)!;
    const riskItem = {
      criterion: criterion.name,
      score: score.score,
      description: score.rationale,
    };

    if (score.score < 2.5) {
      riskAnalysis.highRisk.push(riskItem);
    } else if (score.score < 3.5) {
      riskAnalysis.mediumRisk.push(riskItem);
    } else {
      riskAnalysis.lowRisk.push(riskItem);
    }
  });

  return {
    totalScore: totalWeightedScore,
    decision,
    criterionScores: scores,
    timestamp: new Date().toISOString(),
    passedThresholds,
    thresholdChecks,
    riskAnalysis,
  };
}

function getDecisionColor(decision: Decision) {
  if (decision.includes("STRONG GO")) return chalk.bold.green;
  if (decision === "GO") return chalk.green;
  if (decision === "CONDITIONAL GO") return chalk.yellow;
  if (decision === "NO-GO") return chalk.red;
  return chalk.bold.red;
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
