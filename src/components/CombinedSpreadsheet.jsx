import { useState, useMemo } from 'react'
import { employees as allEmployees } from '../data/employees'

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDelta = (value, type = 'number') => {
  if (typeof value !== 'number') return ''
  const prefix = value >= 0 ? '+' : ''
  if (type === 'currency') {
    return prefix + formatCurrency(value)
  }
  return prefix + value
}

export default function CombinedSpreadsheet({ bulkChange }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [filterText, setFilterText] = useState('')

  // Combine all employees across all actions
  const combinedData = useMemo(() => {
    const employeeMap = new Map()

    bulkChange.actions?.forEach(action => {
      action.employees?.forEach(empChange => {
        const emp = empChange.employee
        if (!emp) return

        if (!employeeMap.has(emp.id)) {
          employeeMap.set(emp.id, {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            department: emp.department,
            title: emp.title,
            level: emp.level,
            changes: {},
            actions: [],
            validations: [],
          })
        }

        const entry = employeeMap.get(emp.id)
        entry.actions.push(action.name)

        // Merge changes
        if (empChange.changes) {
          Object.entries(empChange.changes).forEach(([attr, change]) => {
            entry.changes[attr] = change
          })
        }

        // Collect validations
        if (empChange.validation) {
          const validations = Array.isArray(empChange.validation) ? empChange.validation : [empChange.validation]
          entry.validations.push(...validations)
        }
      })
    })

    return Array.from(employeeMap.values())
  }, [bulkChange])

  // Get all unique changed attributes
  const changedAttributes = useMemo(() => {
    const attrs = new Set()
    combinedData.forEach(emp => {
      Object.keys(emp.changes).forEach(attr => attrs.add(attr))
    })
    return Array.from(attrs)
  }, [combinedData])

  // Filter and sort
  const filteredData = useMemo(() => {
    let data = combinedData

    if (filterText) {
      const lower = filterText.toLowerCase()
      data = data.filter(emp =>
        emp.name.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.department.toLowerCase().includes(lower)
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
  }, [combinedData, filterText, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-300 ml-1">↕</span>
    }
    return <span className="text-indigo-600 ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  }

  const attrLabels = {
    salary: 'Base Salary',
    bonusTarget: 'Bonus Target',
    level: 'Level',
    title: 'Title',
    department: 'Department',
    location: 'Location',
    state: 'State',
    managerId: 'Manager',
    managerName: 'Manager',
    costCenter: 'Cost Center',
    taxJurisdictionState: 'Tax State',
    timezone: 'Timezone',
    city: 'City',
  }

  // Helper to get manager name from ID
  const getManagerName = (managerId) => {
    if (!managerId) return '—'
    const manager = allEmployees.find(e => e.id === managerId)
    return manager?.name || managerId
  }

  // Format a value for display, handling special cases like managerId
  const formatValue = (attr, value) => {
    if (value === null || value === undefined) return '—'
    if (attr === 'managerId') return getManagerName(value)
    if (['salary', 'bonusTarget'].includes(attr)) return formatCurrency(value)
    return value
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filter by name, email, or department..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-64 text-sm border-0 focus:ring-0 placeholder-gray-400"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredData.length} of {combinedData.length} employees
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Employee <SortIcon columnKey="name" />
              </th>
              <th
                onClick={() => handleSort('department')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Department <SortIcon columnKey="department" />
              </th>
              {changedAttributes.map(attr => (
                <th
                  key={attr}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {attrLabels[attr] || attr}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.slice(0, 50).map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.email}</p>
                    </div>
                    {emp.validations.length > 0 && (
                      <div className="flex items-center gap-1">
                        {emp.validations.some(v => v.type === 'error' || v.blocking) && (
                          <span className="w-2 h-2 rounded-full bg-red-500" title="Has errors"></span>
                        )}
                        {emp.validations.some(v => v.type === 'warning' && !v.blocking) && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" title="Has warnings"></span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{emp.department}</td>
                {changedAttributes.map(attr => {
                  const change = emp.changes[attr]
                  if (!change) {
                    return <td key={attr} className="px-4 py-3 text-sm text-gray-300">—</td>
                  }
                  const isCurrency = ['salary', 'bonusTarget'].includes(attr)
                  return (
                    <td key={attr} className="px-4 py-3">
                      <div className="text-sm">
                        <span className="text-gray-400 line-through mr-2">
                          {formatValue(attr, change.current)}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {formatValue(attr, change.new)}
                        </span>
                        {change.delta !== undefined && (
                          <span className={`ml-2 text-xs ${change.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatDelta(change.delta, isCurrency ? 'currency' : 'number')}
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {emp.actions.map((action, i) => (
                      <span
                        key={i}
                        className="inline-flex px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > 50 && (
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-500 text-center">
          Showing 50 of {filteredData.length} employees. Use filters to narrow results.
        </div>
      )}
    </div>
  )
}
