import { Link } from 'react-router-dom'
import { useBulkChanges } from '../context/BulkChangeContext'

export default function BulkChangeList() {
  const { bulkChanges } = useBulkChanges()

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-amber-100 text-amber-800',
      pending_approval: 'bg-blue-100 text-blue-800',
      approved: 'bg-emerald-100 text-emerald-800',
      committed: 'bg-gray-100 text-gray-700',
    }
    const labels = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      committed: 'Committed',
    }
    return { style: styles[status] || styles.draft, label: labels[status] || status }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getValidationSummary = (validation) => {
    if (!validation) return null
    const { errors, warnings } = validation
    if (errors === 0 && warnings === 0) return null
    return { errors, warnings }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bulk Changes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage employee attribute changes at scale
        </p>
      </div>

      {bulkChanges.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900">No bulk changes yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new bulk change.</p>
          <Link
            to="/create"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Create Bulk Change
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bulkChanges.map((bc) => {
            const status = getStatusBadge(bc.status)
            const validation = getValidationSummary(bc.validation)

            return (
              <Link
                key={bc.id}
                to={`/builder/${bc.id}`}
                className="block bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {bc.name}
                      </h3>
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${status.style}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {bc.effectiveDate && (
                        <span>Effective: {formatDate(bc.effectiveDate)}</span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {bc.description && (
                    <p className="text-sm text-gray-500 mb-4">{bc.description}</p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{bc.employeeCount}</span>
                      <span className="text-gray-500">employees</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-700 font-medium">{bc.actions?.length || 0}</span>
                      <span className="text-gray-500">actions</span>
                    </div>

                    {validation && (
                      <>
                        {validation.errors > 0 && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-600 font-medium">{validation.errors}</span>
                            <span className="text-red-600">errors</span>
                          </div>
                        )}
                        {validation.warnings > 0 && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-amber-600 font-medium">{validation.warnings}</span>
                            <span className="text-amber-600">warnings</span>
                          </div>
                        )}
                      </>
                    )}

                    <div className="ml-auto text-gray-400 text-xs">
                      Updated {formatDate(bc.updatedAt)}
                    </div>
                  </div>

                  {/* Action type pills */}
                  {bc.actions && bc.actions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {bc.actions.map((action) => (
                        <span
                          key={action.id}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {action.name}
                          <span className="ml-1.5 text-gray-500">({action.employeeCount})</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
