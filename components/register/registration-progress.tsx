import { cn } from "@/lib/utils";

type Step = {
  number: number;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
};

type RegistrationProgressProps = {
  currentStep: number;
  className?: string;
};

const STEPS = [
  { number: 1, title: "規約同意" },
  { number: 2, title: "プラン選択" },
  { number: 3, title: "アカウント作成" },
  { number: 4, title: "お支払い" },
];

export function RegistrationProgress({ currentStep, className }: RegistrationProgressProps) {
  const steps: Step[] = STEPS.map((step) => ({
    ...step,
    isCompleted: step.number < currentStep,
    isCurrent: step.number === currentStep,
  }));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* ステップサークル */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors",
                  step.isCompleted && "bg-primary text-primary-foreground",
                  step.isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !step.isCompleted && !step.isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {step.isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div
                className={cn(
                  "mt-2 text-xs font-medium text-center whitespace-nowrap",
                  step.isCurrent && "text-foreground",
                  !step.isCurrent && "text-muted-foreground"
                )}
              >
                {step.title}
              </div>
            </div>

            {/* 接続線（最後のステップ以外） */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-muted">
                <div
                  className={cn(
                    "h-full bg-primary transition-all",
                    step.isCompleted ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 進捗テキスト */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        ステップ {currentStep} / {STEPS.length}
      </div>
    </div>
  );
}
