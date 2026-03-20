"use client";

interface BookingStepperProps {
  currentStep: number;
  steps: string[];
}

export function BookingStepper({ currentStep, steps }: BookingStepperProps) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div
              key={step}
              className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : isComplete
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isComplete
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
