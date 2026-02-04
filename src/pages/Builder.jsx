import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useBulkChanges } from '../context/BulkChangeContext'
import ProgressStepper from '../components/ProgressStepper'
import RollupCard from '../components/RollupCard'
import CombinedSpreadsheet from '../components/CombinedSpreadsheet'
import ValidationPanel from '../components/ValidationPanel'
import AddActionModal from '../components/AddActionModal'
import ActionDetailView from '../components/ActionDetailView'
import { EffectiveDateForm, SelfApprovalGate, ApprovalTracker, CommitConfirmation } from '../components/ApprovalFlow'
import ExecutionMonitor from '../components/ExecutionMonitor'

export default function Builder() {
  const { id } = useParams()
  const { getBulkChange, addAction, updateBulkChange, advanceStep, goToStep } = useBulkChanges()
  const bulkChange = getBulkChange(id)
  const [activeTab, setActiveTab] = useState('rollup') // 'rollup' | 'spreadsheet'
  const [selectedActionId, setSelectedActionId] = useState(null)
  const [showAddAction, setShowAddAction] = useState(false)
  const [showCommitModal, setShowCommitModal] = useState(false)

  if (!bulkChange) {
    return <Navigate to="/" replace />
  }

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-amber-100 text-amber-800',
      pending_approval: 'bg-blue-100 text-blue-800',
      approved: 'bg-emerald-100 text-emerald-800',
      committed: 'bg-gray-100 text-gray-700',
    }
    return styles[status] || styles.draft
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const totalEmployees = bulkChange.employeeCount || 0
  const totalActions = bulkChange.actions?.length || 0
  const validation = bulkChange.validation || { errors: 0, warnings: 0 }

  return (
    <div className="-mx-6 -mt-8">
      {/* Progress Stepper */}
      <ProgressStepper
        currentStep={bulkChange.currentStep}
        completedSteps={bulkChange.completedSteps}
      />

      {/* Builder Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-gray-900">{bulkChange.name}</h1>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(bulkChange.status)}`}>
                    {bulkChange.status.replace('_', ' ')}
                  </span>
                </div>
                {bulkChange.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{bulkChange.description}</p>
                )}
              </div>
            </div>
            {bulkChange.effectiveDate && (
              <div className="text-sm text-gray-500">
                Effective: <span className="font-medium text-gray-700">{formatDate(bulkChange.effectiveDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats Bar - Only on Build Actions step */}
      {bulkChange.currentStep === 2 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">
                    <span className="font-semibold text-gray-900">{totalEmployees}</span>
                    <span className="text-gray-500 ml-1">employees in scope</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">
                    <span className="font-semibold text-gray-900">{totalActions}</span>
                    <span className="text-gray-500 ml-1">actions</span>
                  </span>
                </div>
                {(validation.errors > 0 || validation.warnings > 0) && (
                  <div className="flex items-center gap-4">
                    {validation.errors > 0 && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-red-600">{validation.errors} errors</span>
                      </div>
                    )}
                    {validation.warnings > 0 && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-amber-600">{validation.warnings} warnings</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveTab('rollup')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'rollup'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Rollup Cards
                  </button>
                  <button
                    onClick={() => setActiveTab('spreadsheet')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'spreadsheet'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Spreadsheet
                  </button>
                </div>
                <button
                  onClick={() => setShowAddAction(true)}
                  className="ml-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Step 2: Build Actions */}
        {bulkChange.currentStep === 2 && (
          <>
            {totalActions === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No actions yet</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                  Start building your bulk change by adding actions.
                </p>
                <button onClick={() => setShowAddAction(true)} className="mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                  Add Action
                </button>
              </div>
            ) : (
              <div className="flex gap-6">
                <div className="flex-1">
                  {activeTab === 'rollup' ? (
                    <div className="space-y-4">
                      {bulkChange.actions.map((action) => (
                        <RollupCard key={action.id} action={action} bulkChange={bulkChange} isSelected={selectedActionId === action.id} onClick={() => setSelectedActionId(action.id === selectedActionId ? null : action.id)} />
                      ))}
                      <button onClick={() => advanceStep(bulkChange.id)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
                        Continue to Review & Validate →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CombinedSpreadsheet bulkChange={bulkChange} />
                      <button onClick={() => advanceStep(bulkChange.id)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600">
                        Continue to Review & Validate →
                      </button>
                    </div>
                  )}
                </div>
                {(validation.errors > 0 || validation.warnings > 0) && (
                  <div className="w-80 flex-shrink-0">
                    <ValidationPanel validation={bulkChange.validation} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Step 3: Review & Validate */}
        {bulkChange.currentStep === 3 && (
          <div className="space-y-6">
            {/* Validation Summary */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Review & Validate</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review all changes and resolve any blocking errors before proceeding
                </p>
              </div>

              {/* Status Banner */}
              {validation.errors > 0 ? (
                <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-red-800">
                        {validation.errors} blocking {validation.errors === 1 ? 'error' : 'errors'} must be resolved
                      </p>
                      <p className="text-sm text-red-600">You cannot proceed until all blocking errors are fixed</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-emerald-800">No blocking errors</p>
                      <p className="text-sm text-emerald-600">
                        {validation.warnings > 0 || validation.dependencies > 0
                          ? [
                              validation.warnings > 0 && `${validation.warnings} ${validation.warnings === 1 ? 'warning' : 'warnings'}`,
                              validation.dependencies > 0 && `${validation.dependencies} ${validation.dependencies === 1 ? 'dependency' : 'dependencies'}`
                            ].filter(Boolean).join(', ') + ' to review (non-blocking)'
                          : 'All validations passed'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Items */}
              <div className="divide-y divide-gray-100">
                {bulkChange.validation?.items?.filter(i => i.type === 'error').map((item, i) => (
                  <div key={`error-${i}`} className="px-6 py-4 bg-red-50/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-red-800">{item.message}</p>
                        {item.count && (
                          <p className="text-sm text-red-600 mt-1">Affects {item.count} employees</p>
                        )}
                        <p className="text-xs text-red-500 mt-2">
                          Action: {bulkChange.actions.find(a => a.id === item.actionId)?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">Blocking</span>
                    </div>
                  </div>
                ))}

                {bulkChange.validation?.items?.filter(i => i.type === 'warning').map((item, i) => (
                  <div key={`warn-${i}`} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-amber-800">{item.message}</p>
                        {item.count && (
                          <p className="text-sm text-amber-600 mt-1">Affects {item.count} employees</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Action: {bulkChange.actions.find(a => a.id === item.actionId)?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Warning</span>
                    </div>
                  </div>
                ))}

                {/* Dependencies */}
                {bulkChange.validation?.items?.filter(i => i.type === 'dependency').map((item, i) => (
                  <div key={`dep-${i}`} className="px-6 py-4 bg-violet-50/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-violet-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium text-violet-800">{item.message}</p>
                        {item.description && (
                          <p className="text-sm text-violet-700 mt-1">{item.description}</p>
                        )}
                        {item.count && (
                          <p className="text-sm text-violet-600 mt-1">Affects {item.count} employees</p>
                        )}
                        {item.requiredAction && (
                          <div className="mt-3 p-2 bg-violet-100 rounded text-sm text-violet-800">
                            <span className="font-medium">Required action:</span> {item.requiredAction}
                          </div>
                        )}
                        <p className="text-xs text-violet-500 mt-2">
                          {item.affectedSystem && <span className="mr-2">System: {item.affectedSystem}</span>}
                          Action: {bulkChange.actions.find(a => a.id === item.actionId)?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded">Dependency</span>
                    </div>
                  </div>
                ))}

                {bulkChange.validation?.items?.filter(i => i.type === 'info').map((item, i) => (
                  <div key={`info-${i}`} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-gray-700">{item.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Action: {bulkChange.actions.find(a => a.id === item.actionId)?.name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">Info</span>
                    </div>
                  </div>
                ))}

                {(!bulkChange.validation?.items || bulkChange.validation.items.length === 0) && (
                  <div className="px-6 py-8 text-center">
                    <svg className="w-10 h-10 text-emerald-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-500">All validations passed — no issues found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary of Changes */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Changes Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                    <p className="text-sm text-gray-500 mt-1">Employees in Scope</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-gray-900">{totalActions}</p>
                    <p className="text-sm text-gray-500 mt-1">Actions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xl font-bold text-gray-900">
                      {bulkChange.actions.reduce((acc, a) => {
                        const attrs = a.employees?.[0]?.changes ? Object.keys(a.employees[0].changes) : []
                        return acc + attrs.length
                      }, 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Attributes Changing</p>
                  </div>
                </div>

                {/* Actions List */}
                <div className="mt-6 space-y-3">
                  {bulkChange.actions.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{action.name}</p>
                          <p className="text-sm text-gray-500">{action.employeeCount} employees</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedActionId(action.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => goToStep(bulkChange.id, 2)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Back to Build Actions
              </button>
              <button
                onClick={() => advanceStep(bulkChange.id)}
                disabled={validation.errors > 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  validation.errors > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {validation.errors > 0
                  ? `Resolve ${validation.errors} ${validation.errors === 1 ? 'Error' : 'Errors'} to Continue`
                  : 'Continue to Set Effective Date →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Set Effective Date */}
        {bulkChange.currentStep === 4 && (
          <EffectiveDateForm
            bulkChange={bulkChange}
            onSave={(data) => { updateBulkChange(bulkChange.id, data); advanceStep(bulkChange.id) }}
            onBack={() => goToStep(bulkChange.id, 3)}
          />
        )}

        {/* Step 5: Self-Approval */}
        {bulkChange.currentStep === 5 && (
          <SelfApprovalGate
            bulkChange={bulkChange}
            onApprove={() => advanceStep(bulkChange.id)}
            onBack={() => goToStep(bulkChange.id, 4)}
          />
        )}

        {/* Step 6: Approval Tracker */}
        {bulkChange.currentStep === 6 && (
          <ApprovalTracker
            bulkChange={bulkChange}
            onSubmit={() => setShowCommitModal(true)}
            onBack={() => goToStep(bulkChange.id, 5)}
          />
        )}

        {/* Step 7: Monitoring */}
        {bulkChange.currentStep === 7 && (
          <ExecutionMonitor bulkChange={bulkChange} />
        )}
      </div>

      {/* Commit Confirmation Modal */}
      {showCommitModal && (
        <CommitConfirmation
          bulkChange={bulkChange}
          onConfirm={() => { updateBulkChange(bulkChange.id, { status: 'committed' }); advanceStep(bulkChange.id); setShowCommitModal(false) }}
          onCancel={() => setShowCommitModal(false)}
        />
      )}

      {/* Add Action Modal */}
      <AddActionModal
        isOpen={showAddAction}
        onClose={() => setShowAddAction(false)}
        onAdd={(action) => {
          addAction(bulkChange.id, action)
          setShowAddAction(false)
        }}
      />

      {/* Action Detail View */}
      {selectedActionId && (
        <ActionDetailView
          action={bulkChange.actions.find(a => a.id === selectedActionId)}
          onClose={() => setSelectedActionId(null)}
          onUpdate={(updates) => {
            // Handle updates
            setSelectedActionId(null)
          }}
        />
      )}
    </div>
  )
}
