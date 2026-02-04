import { useState } from 'react'

// Step 4: Set Effective Date
export function EffectiveDateForm({ bulkChange, onSave, onBack }) {
  const [effectiveDate, setEffectiveDate] = useState(bulkChange.effectiveDate || '')
  const [reason, setReason] = useState(bulkChange.reason || '')

  const minDate = new Date().toISOString().split('T')[0]
  const payrollCutoff = new Date()
  payrollCutoff.setDate(payrollCutoff.getDate() + 12)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Set Effective Date</h2>
        <p className="text-sm text-gray-500 mb-6">When should these changes take effect?</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              min={minDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {effectiveDate && new Date(effectiveDate) <= payrollCutoff && (
              <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Changes will be included in the next payroll run if approved by cutoff
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason / Comment <span className="text-gray-400">(for audit trail)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g., Per Q1 performance review decisions approved by CFO on 1/28"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Review
          </button>
          <button
            onClick={() => onSave({ effectiveDate, reason })}
            disabled={!effectiveDate}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Continue to Approval
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 5: Self-Approval Gate
export function SelfApprovalGate({ bulkChange, onApprove, onBack }) {
  const [checks, setChecks] = useState({ reviewed: false, transaction: false })

  const allChecked = Object.values(checks).every(Boolean)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Self-Approval</h2>
        <p className="text-sm text-gray-500 mb-6">Review and confirm before routing to approvers</p>

        <div className="space-y-4">
          {[
            { key: 'reviewed', label: 'I have reviewed the rollup and detail views for all actions' },
            { key: 'transaction', label: 'I understand these changes will be applied as a single transaction (all or nothing)' },
          ].map(item => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checks[item.key]}
                onChange={(e) => setChecks(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                {item.label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> {bulkChange.effectiveDate ? new Date(bulkChange.effectiveDate).toLocaleDateString() : 'Not set'}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Approvers will see this date and understand the urgency.
          </p>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <button
            onClick={onApprove}
            disabled={!allChecked}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Confirm & Route to Approvers
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 5-6: Approval Tracker
export function ApprovalTracker({ bulkChange, onSubmit, onBack }) {
  const approvers = bulkChange.approvers || []
  const allApproved = approvers.length === 0 || approvers.every(a => a.status === 'approved')

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
      overdue: 'bg-red-100 text-red-800',
    }
    return styles[status] || styles.pending
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Approval Status</h2>
            <p className="text-sm text-gray-500">
              Effective: {bulkChange.effectiveDate ? new Date(bulkChange.effectiveDate).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          {allApproved && approvers.length > 0 && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
              All Approved
            </span>
          )}
        </div>

        {approvers.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-900 font-medium">No approval required</p>
            <p className="text-sm text-gray-500 mt-1">This change is within your authority</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {approvers.map((approver) => (
              <div key={approver.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{approver.scope}</p>
                    <p className="text-sm text-gray-500">{approver.employeeCount} employees</p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusBadge(approver.status)}`}>
                    {approver.status === 'approved' ? `Approved ${formatDate(approver.approvedAt)}` : approver.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Approver:</span>
                    <span className="ml-2 text-gray-900">{approver.approver?.name || 'Unknown'}</span>
                  </div>
                  {approver.approver?.email && (
                    <a href={`mailto:${approver.approver.email}`} className="text-indigo-600 hover:text-indigo-800">
                      {approver.approver.email}
                    </a>
                  )}
                </div>
                {approver.backup && (
                  <p className="mt-1 text-xs text-gray-500">
                    Backup: {approver.backup.name} ({approver.backup.email})
                  </p>
                )}
                {approver.dueAt && approver.status === 'pending' && (
                  <p className="mt-2 text-xs text-amber-600">
                    Due: {new Date(approver.dueAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <button
            onClick={onSubmit}
            disabled={!allApproved}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {allApproved ? 'Submit & Commit' : 'Waiting for Approvals'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Step 6: Final Commit Confirmation
export function CommitConfirmation({ bulkChange, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Confirm Commit</h2>
        <p className="text-sm text-gray-500 mb-6">
          You are about to commit <strong>{bulkChange.employeeCount}</strong> employee changes as a single transaction
          with effective date <strong>{bulkChange.effectiveDate ? new Date(bulkChange.effectiveDate).toLocaleDateString() : 'immediate'}</strong>.
        </p>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
          <p className="text-sm text-amber-800 font-medium">Transaction Semantics</p>
          <p className="text-sm text-amber-700 mt-1">
            All changes will be applied together. If any change cannot be applied, none will be applied.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  )
}
