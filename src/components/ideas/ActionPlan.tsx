"use client";

import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";

interface ActionStep {
  order: number;
  action: string;
  owner: string;
  timeline: string;
  deliverable: string;
}

interface ActionPlanData {
  steps: ActionStep[];
  quick_wins: string[];
  dependencies: string[];
  success_metrics: string[];
}

interface ActionPlanProps {
  plan: ActionPlanData;
  recommendation?: string;
}

export function ActionPlan({ plan, recommendation }: ActionPlanProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Actieplan</h2>

      {/* Recommendation */}
      {recommendation && (
        <BrutalCard hover={false} borderColor="border-wine" className="p-4">
          <h3 className="font-accent text-xs font-bold uppercase tracking-widest mb-2">
            Aanbeveling
          </h3>
          <p className="font-body text-lg">{recommendation}</p>
        </BrutalCard>
      )}

      {/* Quick wins */}
      {plan.quick_wins.length > 0 && (
        <div>
          <h3 className="font-accent text-xs font-bold uppercase tracking-widest mb-3">
            Quick Wins
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.quick_wins.map((win, i) => (
              <BrutalBadge key={i} variant="emerald">
                {win}
              </BrutalBadge>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      {plan.steps.length > 0 && (
        <div>
          <h3 className="font-accent text-xs font-bold uppercase tracking-widest mb-3">
            Stappen
          </h3>
          <div className="space-y-3">
            {plan.steps.map((step) => (
              <BrutalCard key={step.order} hover={false} className="p-4">
                <div className="flex items-start gap-4">
                  <span className="font-display text-2xl font-bold text-wine shrink-0">
                    {String(step.order).padStart(2, "0")}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="font-body font-semibold">{step.action}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-accent text-xs text-gray-500 uppercase tracking-wider">
                      <span>Eigenaar: {step.owner}</span>
                      <span>Timeline: {step.timeline}</span>
                    </div>
                    {step.deliverable && (
                      <p className="font-body text-sm text-gray-600">
                        Deliverable: {step.deliverable}
                      </p>
                    )}
                  </div>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {plan.dependencies.length > 0 && (
        <div>
          <h3 className="font-accent text-xs font-bold uppercase tracking-widest mb-2">
            Afhankelijkheden
          </h3>
          <ul className="space-y-1">
            {plan.dependencies.map((dep, i) => (
              <li key={i} className="font-body text-sm">
                &bull; {dep}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success metrics */}
      {plan.success_metrics.length > 0 && (
        <div>
          <h3 className="font-accent text-xs font-bold uppercase tracking-widest mb-2">
            Succescriteria
          </h3>
          <ul className="space-y-1">
            {plan.success_metrics.map((metric, i) => (
              <li key={i} className="font-body text-sm">
                &bull; {metric}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
