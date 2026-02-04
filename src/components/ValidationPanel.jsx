export default function ValidationPanel({ validation }) {
  if (!validation) return null

  const { items = [], errors = 0, warnings = 0, info = 0, dependencies = 0 } = validation

  const errorItems = items.filter(i => i.type === 'error')
  const warningItems = items.filter(i => i.type === 'warning')
  const dependencyItems = items.filter(i => i.type === 'dependency')
  const infoItems = items.filter(i => i.type === 'info')

  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-4">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Validation</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Resolve errors before proceeding
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Errors Section */}
        {errorItems.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-700">
                {errors} Blocking {errors === 1 ? 'Error' : 'Errors'}
              </span>
            </div>
            <div className="space-y-2">
              {errorItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                >
                  <p className="text-sm text-red-800">{item.message}</p>
                  {item.count && (
                    <p className="text-xs text-red-600 mt-1">Affects {item.count} employees</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {warningItems.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-amber-700">
                {warnings} {warnings === 1 ? 'Warning' : 'Warnings'}
              </span>
            </div>
            <div className="space-y-2">
              {warningItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-100 cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <p className="text-sm text-amber-800">{item.message}</p>
                  {item.count && (
                    <p className="text-xs text-amber-600 mt-1">Affects {item.count} employees</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dependencies Section */}
        {dependencyItems.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm font-medium text-violet-700">
                {dependencyItems.length} {dependencyItems.length === 1 ? 'Dependency' : 'Dependencies'}
              </span>
            </div>
            <div className="space-y-2">
              {dependencyItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-violet-50 rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-100 transition-colors"
                >
                  <p className="text-sm font-medium text-violet-800">{item.message}</p>
                  {item.count && (
                    <p className="text-xs text-violet-600 mt-1">Affects {item.count} employees</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        {infoItems.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-blue-700">
                {infoItems.length} Info
              </span>
            </div>
            <div className="space-y-2">
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <p className="text-sm text-blue-800">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No issues */}
        {errorItems.length === 0 && warningItems.length === 0 && dependencyItems.length === 0 && infoItems.length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-500">No validation issues</p>
          </div>
        )}
      </div>
    </div>
  )
}
