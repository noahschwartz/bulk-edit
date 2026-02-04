const STEPS = [
  { id: 1, name: 'Create', shortName: 'Create' },
  { id: 2, name: 'Build Actions', shortName: 'Build' },
  { id: 3, name: 'Review & Validate', shortName: 'Review' },
  { id: 4, name: 'Set Effective Date', shortName: 'Date' },
  { id: 5, name: 'Approve', shortName: 'Approve' },
  { id: 6, name: 'Submit', shortName: 'Submit' },
  { id: 7, name: 'Monitor', shortName: 'Monitor' },
]

export default function ProgressStepper({ currentStep = 1, completedSteps = [] }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {STEPS.map((step, stepIdx) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = step.id === currentStep
              const isUpcoming = step.id > currentStep && !isCompleted

              return (
                <li key={step.id} className="flex items-center">
                  {/* Step indicator */}
                  <div className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        ${isCompleted
                          ? 'bg-indigo-600 text-white'
                          : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                            : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`
                        ml-2 text-sm font-medium hidden sm:block
                        ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}
                      `}
                    >
                      {step.name}
                    </span>
                    <span
                      className={`
                        ml-2 text-sm font-medium sm:hidden
                        ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}
                      `}
                    >
                      {step.shortName}
                    </span>
                  </div>

                  {/* Connector line */}
                  {stepIdx < STEPS.length - 1 && (
                    <div
                      className={`
                        hidden sm:block w-12 lg:w-24 h-0.5 mx-2
                        ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}
                      `}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}

export { STEPS }
