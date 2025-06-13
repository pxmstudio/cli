import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export function ProgressBar({
  steps,
  currentStep,
  onStepClick,
  className,
}: {
  steps: { step: number; label: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      {steps.map((step) => (
        <ProgressBarStep
          key={step.step}
          {...step}
          isCurrent={step.step === currentStep}
          onClick={onStepClick ? () => onStepClick(step.step) : undefined}
          isClickable={!!onStepClick && step.step <= currentStep}
        />
      ))}
    </div>
  );
}

export function ProgressBarStep({
  step,
  label,
  isCurrent,
  onClick,
  isClickable,
}: {
  step: number;
  label: string;
  isCurrent: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}) {
  const Wrapper = isClickable ? Button : "div";
  const wrapperProps = isClickable
    ? {
        variant: "ghost" as const,
        onClick,
        className: "hover:bg-transparent",
      }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={cn(
          "inline-flex items-center gap-2 p-1 rounded",
          isCurrent ? "bg-background2" : "text-text3",
          isClickable && !isCurrent ? "cursor-pointer hover:text-text1" : ""
        )}
      >
        <Badge
          variant="outline"
          className={cn(
            "size-5 inline-flex items-center justify-center text-center leading-none",
            isCurrent ? "text-primary" : "text-text3",
            isClickable && !isCurrent ? "hover:text-text1" : ""
          )}
        >
          {step}
        </Badge>
        <p className="text-sm whitespace-nowrap">{label}</p>
      </div>
    </Wrapper>
  );
}
