import { RIPPLING_APPS, CONNECTED_APPS } from '../data/downstreamApps'

export default function ExecutionMonitor({ bulkChange }) {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-emerald-900">{bulkChange.name}</h2>
        <p className="text-emerald-700">Committed | Effective: {formatDate(bulkChange.effectiveDate)}</p>
      </div>

      {/* Employee Graph */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">EMPLOYEE GRAPH</h3>
        </div>
        <div className="px-6 py-4 flex items-center gap-3">
          <span className="text-emerald-500 text-xl">✓</span>
          <span className="text-gray-900">All changes applied</span>
          <span className="ml-auto text-gray-500">{bulkChange.employeeCount} employees updated</span>
        </div>
      </div>

      {/* Rippling Apps */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">RIPPLING APPS</h3>
          <p className="text-xs text-gray-500 mt-1">Rippling's own products — we know exactly when they've processed</p>
        </div>
        <div className="divide-y divide-gray-100">
          {RIPPLING_APPS.map((app, i) => (
            <div key={app.id} className="px-6 py-3 flex items-center justify-between">
              <span className="text-gray-900">{app.name}</span>
              <div className="flex items-center gap-2">
                {i === 0 ? (
                  <><span className="text-blue-500">🔄</span><span className="text-sm text-blue-600">Scheduled</span><span className="text-xs text-gray-400">Will process in next payroll run</span></>
                ) : (
                  <><span className="text-emerald-500">✓</span><span className="text-sm text-emerald-600">Updated</span></>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Apps */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">CONNECTED APPS</h3>
          <p className="text-xs text-gray-500 mt-1">Third-party apps — status shows whether the app received updates</p>
        </div>
        <div className="divide-y divide-gray-100">
          {CONNECTED_APPS.slice(0, 3).map((app, i) => (
            <div key={app.id} className="px-6 py-3 flex items-center justify-between">
              <span className="text-gray-900">{app.name}</span>
              <div className="flex items-center gap-2">
                {i === 1 ? (
                  <><span className="text-amber-500">⚠</span><span className="text-sm text-amber-600">Sent, 1 issue</span><span className="text-xs text-gray-400">Retry pending</span></>
                ) : (
                  <><span className="text-emerald-500">✓</span><span className="text-sm text-emerald-600">Sent & confirmed</span></>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
