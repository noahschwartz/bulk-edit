import { useState, useMemo } from 'react'
import { COMMON_ACTIONS } from '../data/attributes'
import { employees as allEmployees } from '../data/employees'

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

const getManagerName = (managerId) => {
  if (!managerId) return '—'
  const manager = allEmployees.find(e => e.id === managerId)
  return manager?.name || managerId
}

const formatValue = (attr, value) => {
  if (value === null || value === undefined) return '—'
  if (attr === 'managerId') return getManagerName(value)
  if (['salary', 'bonusTarget', 'hourlyRate'].includes(attr)) return formatCurrency(value)
  return value
}

export default function ActionDetailView({ action, onClose, onUpdate }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [filterText, setFilterText] = useState('')
  const [editingCell, setEditingCell] = useState(null) // { employeeId, attr }
  const [editValue, setEditValue] = useState('')

  const actionDef = COMMON_ACTIONS.find(a => a.id === action.type)
  const attributes = actionDef?.attributes || []

  // Get employees with their changes
  const employeeData = useMemo(() => {
    return action.employees?.map(e => ({
      ...e.employee,
      changes: e.changes || {},
      validation: e.validation,
    })) || []
  }, [action])

  // Filter and sort
  const filteredData = useMemo(() => {
    let data = employeeData

    if (filterText) {
      const lower = filterText.toLowerCase()
      data = data.filter(emp =>
        emp.name?.toLowerCase().includes(lower) ||
        emp.department?.toLowerCase().includes(lower)
      )
    }

    data.sort((a, b) => {
      let aVal = a[sortConfig.key] || ''
      let bVal = b[sortConfig.key] || ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return data
  }, [employeeData, filterText, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const startEdit = (employeeId, attr, currentValue) => {
    setEditingCell({ employeeId, attr })
    setEditValue(currentValue?.toString() || '')
  }

  const saveEdit = () => {
    if (!editingCell) return
    // In a real app, this would update the state
    console.log('Save:', editingCell, editValue)
    setEditingCell(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-indigo-600 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  }

  const attrLabels = {
    salary: 'Base Salary', bonusTarget: 'Bonus', level: 'Level', title: 'Title',
    department: 'Department', location: 'Location', state: 'State', managerId: 'Manager',
    costCenter: 'Cost Center', hourlyRate: 'Hourly Rate', city: 'City', timezone: 'Timezone',
  }

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (action.type === 'update_compensation') {
      const salaryChanges = employeeData
        .map(e => e.changes?.salary?.delta)
        .filter(d => typeof d === 'number')
      if (salaryChanges.length > 0) {
        return {
          min: Math.min(...salaryChanges),
          max: Math.max(...salaryChanges),
          total: salaryChanges.reduce((a, b) => a + b, 0),
        }
      }
    }
    return null
  }, [action, employeeData])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex h-full">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />

        {/* Panel */}
        <div className="relative ml-auto w-full max-w-5xl bg-white shadow-xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{action.name}</h2>
              <p className="text-sm text-gray-500">{action.employeeCount} employees</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary Stats */}
          {summaryStats && (
            <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <span className="text-emerald-600">Range:</span>
                  <span className="ml-2 font-medium text-emerald-800">
                    +{formatCurrency(summaryStats.min)} to +{formatCurrency(summaryStats.max)}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600">Total Annual Impact:</span>
                  <span className="ml-2 font-medium text-emerald-800">
                    +{formatCurrency(summaryStats.total)}/yr
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Filter employees..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-64 text-sm border-0 focus:ring-0 placeholder-gray-400"
              />
            </div>
            <span className="text-sm text-gray-500">
              {filteredData.length} of {employeeData.length} employees
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Employee <SortIcon columnKey="name" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dept
                  </th>
                  {attributes.flatMap(attr => [
                    <th
                      key={`current-${attr}`}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200"
                    >
                      {attrLabels[attr] || attr}
                    </th>,
                    <th
                      key={`new-${attr}`}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-indigo-50"
                    >
                      New
                    </th>
                  ])}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.map((emp) => {
                  const hasError = emp.validation?.some?.(v => v.type === 'error' || v.blocking)
                  const hasWarning = emp.validation?.some?.(v => v.type === 'warning' && !v.blocking)
                  const validations = Array.isArray(emp.validation) ? emp.validation : (emp.validation ? [emp.validation] : [])

                  return (
                    <tr key={emp.id} className={`hover:bg-gray-50 ${hasError ? 'bg-red-50/50' : hasWarning ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {emp.name?.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{emp.department}</td>
                      {attributes.flatMap(attr => {
                        const change = emp.changes?.[attr]
                        const isEditing = editingCell?.employeeId === emp.id && editingCell?.attr === attr
                        const isCurrency = ['salary', 'bonusTarget', 'hourlyRate'].includes(attr)
                        const isLargeChange = change?.delta && Math.abs(change.delta / (change.current || 1)) > 0.2

                        return [
                          <td key={`current-${attr}`} className="px-4 py-3 text-sm text-gray-500 border-l border-gray-200">
                            {formatValue(attr, emp[attr])}
                          </td>,
                          <td
                            key={`new-${attr}`}
                            className="px-4 py-3 bg-indigo-50/30"
                            onClick={() => !isEditing && change && startEdit(emp.id, attr, change.new)}
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type={isCurrency ? 'number' : 'text'}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit()
                                    if (e.key === 'Escape') cancelEdit()
                                  }}
                                  autoFocus
                                  className="w-24 px-2 py-1 text-sm border border-indigo-300 rounded"
                                />
                                <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : change ? (
                              <div className={`text-sm cursor-pointer hover:bg-indigo-100 rounded px-1 -mx-1 ${isLargeChange ? 'ring-2 ring-amber-300 ring-offset-1' : ''}`}>
                                <span className="font-medium text-gray-900">
                                  {formatValue(attr, change.new)}
                                </span>
                                {change.delta !== undefined && (
                                  <span className={`ml-2 text-xs ${change.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {change.delta >= 0 ? '+' : ''}{isCurrency ? formatCurrency(change.delta) : change.delta}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ]
                      })}
                      <td className="px-4 py-3">
                        {validations.length > 0 ? (
                          <div className="space-y-1">
                            {validations.map((v, i) => (
                              <div
                                key={i}
                                className={`text-xs px-2 py-1 rounded ${
                                  v.type === 'error' || v.blocking
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                                title={v.message}
                              >
                                {v.code || v.type}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600">✓ Valid</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
