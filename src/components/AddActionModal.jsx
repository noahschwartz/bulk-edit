import { useState, useMemo } from 'react'
import { COMMON_ACTIONS, ATTRIBUTE_CATEGORIES, getAttributeById } from '../data/attributes'
import { employees } from '../data/employees'

const STEPS = ['type', 'attributes', 'employees', 'changes', 'confirm']

export default function AddActionModal({ isOpen, onClose, onAdd }) {
  const [step, setStep] = useState('type')
  const [actionType, setActionType] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [employeeTab, setEmployeeTab] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [pasteInput, setPasteInput] = useState('')
  const [changeMode, setChangeMode] = useState('uniform') // 'uniform' | 'per-employee'
  const [uniformValues, setUniformValues] = useState({})
  const [perEmployeeValues, setPerEmployeeValues] = useState({})
  const [selectedAttributes, setSelectedAttributes] = useState([]) // for custom action
  const [activeCategory, setActiveCategory] = useState('employment')

  const actionDef = COMMON_ACTIONS.find(a => a.id === actionType)
  const isCustomAction = actionType === 'custom'

  // Get the attributes for current action (either from actionDef or selected custom attributes)
  const currentAttributes = isCustomAction ? selectedAttributes : (actionDef?.attributes || [])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let result = employees

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      )
    }

    if (filterDepartment) {
      result = result.filter(e => e.department === filterDepartment)
    }

    if (filterLevel) {
      result = result.filter(e => e.level === filterLevel)
    }

    return result
  }, [searchQuery, filterDepartment, filterLevel])

  // Parse pasted emails/IDs
  const parsedPasteEmployees = useMemo(() => {
    if (!pasteInput.trim()) return { matched: [], unmatched: [] }

    const inputs = pasteInput.split(/[\n,]/).map(s => s.trim().toLowerCase()).filter(Boolean)
    const matched = []
    const unmatched = []

    inputs.forEach(input => {
      const emp = employees.find(e =>
        e.email.toLowerCase() === input ||
        e.id.toLowerCase() === input
      )
      if (emp) matched.push(emp)
      else unmatched.push(input)
    })

    return { matched, unmatched }
  }, [pasteInput])

  // Early return AFTER all hooks to follow Rules of Hooks
  if (!isOpen) return null

  const departments = [...new Set(employees.map(e => e.department))].sort()
  const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']

  const toggleEmployee = (emp) => {
    setSelectedEmployees(prev =>
      prev.find(e => e.id === emp.id)
        ? prev.filter(e => e.id !== emp.id)
        : [...prev, emp]
    )
  }

  const selectAllFiltered = () => {
    setSelectedEmployees(prev => {
      const newSet = new Map(prev.map(e => [e.id, e]))
      filteredEmployees.forEach(e => newSet.set(e.id, e))
      return Array.from(newSet.values())
    })
  }

  const handleAddPasted = () => {
    setSelectedEmployees(prev => {
      const newSet = new Map(prev.map(e => [e.id, e]))
      parsedPasteEmployees.matched.forEach(e => newSet.set(e.id, e))
      return Array.from(newSet.values())
    })
  }

  const handleSubmit = () => {
    const action = {
      type: actionType,
      name: isCustomAction ? 'Custom Attribute Update' : actionDef?.name,
      employeeCount: selectedEmployees.length,
      attributes: currentAttributes,
      employees: selectedEmployees.map(emp => {
        let changes = {}
        if (changeMode === 'uniform') {
          changes = Object.fromEntries(
            Object.entries(uniformValues).map(([attr, value]) => [
              attr,
              { current: emp[attr], new: value, delta: typeof value === 'number' ? value - (emp[attr] || 0) : undefined }
            ])
          )
        } else {
          // Per-employee mode: build changes from perEmployeeValues
          const empValues = perEmployeeValues[emp.id] || {}
          Object.entries(empValues).forEach(([attr, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
              changes[attr] = {
                current: emp[attr],
                new: value,
                delta: typeof value === 'number' ? value - (emp[attr] || 0) : undefined
              }
            }
          })
        }
        return {
          employeeId: emp.id,
          employee: emp,
          changes,
        }
      }),
      summary: generateSummary(),
    }
    onAdd(action)
    resetAndClose()
  }

  const generateSummary = () => {
    const getManagerName = (id) => employees.find(e => e.id === id)?.name || id
    const levelOrder = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']
    const compareLevels = (a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b)

    // Helper to get value for an attribute (uniform or per-employee)
    const getValue = (emp, attr) => {
      if (changeMode === 'uniform') return uniformValues[attr]
      return perEmployeeValues[emp.id]?.[attr]
    }

    // Helper to get changes for a numeric field
    const getNumericChanges = (attr) => {
      return selectedEmployees
        .map(e => {
          const newVal = getValue(e, attr)
          if (newVal === undefined || newVal === '' || newVal === null) return null
          return (Number(newVal) || 0) - (e[attr] || 0)
        })
        .filter(v => v !== null)
    }

    // COMPENSATION
    if (actionType === 'update_compensation') {
      const salaryChanges = getNumericChanges('salary')
      const bonusChanges = getNumericChanges('bonusTarget')
      const changes = salaryChanges.length > 0 ? salaryChanges : bonusChanges

      if (changes.length > 0) {
        const sorted = [...changes].sort((a, b) => a - b)
        return {
          minChange: Math.min(...changes),
          maxChange: Math.max(...changes),
          medianChange: sorted[Math.floor(sorted.length / 2)],
          totalAnnualImpact: changes.reduce((a, b) => a + b, 0),
        }
      }
      // Fallback: show employee count even if no numeric changes
      return { employeeCount: selectedEmployees.length }
    }

    // DEPARTMENT
    if (actionType === 'change_department') {
      const transfers = {}
      selectedEmployees.forEach(e => {
        const newDept = getValue(e, 'department')
        if (newDept && newDept !== e.department) {
          const key = `${e.department} → ${newDept}`
          transfers[key] = (transfers[key] || 0) + 1
        }
      })
      if (Object.keys(transfers).length > 0) return { transfers }
      return { employeeCount: selectedEmployees.length }
    }

    // TITLE & LEVEL
    if (actionType === 'update_title_level') {
      let promotions = 0
      let titleChanges = 0
      const levelChanges = []

      selectedEmployees.forEach(e => {
        const newLevel = getValue(e, 'level')
        const newTitle = getValue(e, 'title')

        if (newLevel && e.level && compareLevels(newLevel, e.level) > 0) {
          promotions++
          levelChanges.push(`${e.level} → ${newLevel}`)
        }
        if (newTitle && newTitle !== e.title) {
          titleChanges++
        }
      })

      const summary = {}
      if (promotions > 0) summary.promotions = promotions
      if (titleChanges > 0) summary.titleChanges = titleChanges
      if (levelChanges.length > 0) {
        const uniqueChanges = [...new Set(levelChanges)]
        summary.levelChange = uniqueChanges.length === 1 ? uniqueChanges[0] : `${uniqueChanges.length} different changes`
      }
      if (Object.keys(summary).length === 0) summary.employeeCount = selectedEmployees.length
      return summary
    }

    // LOCATION
    if (actionType === 'reassign_location') {
      const locationChanges = {}
      selectedEmployees.forEach(e => {
        const newLoc = getValue(e, 'location')
        if (newLoc && newLoc !== e.location) {
          const key = `${e.location || 'Unknown'} → ${newLoc}`
          locationChanges[key] = (locationChanges[key] || 0) + 1
        }
      })

      if (Object.keys(locationChanges).length > 0) {
        const entries = Object.entries(locationChanges)
        if (entries.length === 1) {
          const [change, count] = entries[0]
          const [from, to] = change.split(' → ')
          return {
            fromLocation: from,
            toLocation: to,
            taxJurisdictionChange: 'May change',
            employeeCount: count,
          }
        }
        return { transfers: locationChanges }
      }
      return { employeeCount: selectedEmployees.length }
    }

    // MANAGER
    if (actionType === 'change_manager') {
      const changes = []
      selectedEmployees.forEach(e => {
        const newMgr = getValue(e, 'managerId')
        if (newMgr && newMgr !== e.managerId) {
          changes.push({ oldManager: e.managerId, newManager: newMgr })
        }
      })

      if (changes.length > 0) {
        const oldManagers = [...new Set(changes.map(c => c.oldManager).filter(Boolean))]
        const newManagers = [...new Set(changes.map(c => c.newManager))]
        return {
          managerChanges: changes.length,
          oldManagers: oldManagers.length === 1
            ? getManagerName(oldManagers[0])
            : oldManagers.length > 0 ? `${oldManagers.length} different managers` : 'None',
          newManager: newManagers.length === 1
            ? getManagerName(newManagers[0])
            : `${newManagers.length} different managers`,
        }
      }
      return { employeeCount: selectedEmployees.length }
    }

    // TEAM
    if (actionType === 'change_team') {
      const teamChanges = {}
      selectedEmployees.forEach(e => {
        const newTeam = getValue(e, 'team')
        if (newTeam) {
          const key = `→ ${newTeam}`
          teamChanges[key] = (teamChanges[key] || 0) + 1
        }
      })
      if (Object.keys(teamChanges).length > 0) return { transfers: teamChanges }
      return { employeeCount: selectedEmployees.length }
    }

    // SCHEDULE
    if (actionType === 'update_schedule') {
      const scheduleChanges = []
      selectedEmployees.forEach(e => {
        const newType = getValue(e, 'employmentType')
        const newHours = getValue(e, 'hoursPerWeek')
        const newArrangement = getValue(e, 'workArrangement')
        if (newType || newHours || newArrangement) {
          scheduleChanges.push({ newType, newHours, newArrangement })
        }
      })
      if (scheduleChanges.length > 0) {
        const types = [...new Set(scheduleChanges.map(c => c.newType).filter(Boolean))]
        const arrangements = [...new Set(scheduleChanges.map(c => c.newArrangement).filter(Boolean))]
        return {
          scheduleChanges: scheduleChanges.length,
          newType: types.length === 1 ? types[0] : types.length > 0 ? `${types.length} types` : null,
          newArrangement: arrangements.length === 1 ? arrangements[0] : arrangements.length > 0 ? `${arrangements.length} arrangements` : null,
        }
      }
      return { employeeCount: selectedEmployees.length }
    }

    // CUSTOM or unknown
    return { employeeCount: selectedEmployees.length }
  }

  const resetAndClose = () => {
    setStep('type')
    setActionType(null)
    setSelectedEmployees([])
    setSearchQuery('')
    setFilterDepartment('')
    setFilterLevel('')
    setPasteInput('')
    setUniformValues({})
    setPerEmployeeValues({})
    setSelectedAttributes([])
    setActiveCategory('employment')
    onClose()
  }

  const toggleAttribute = (attrId) => {
    setSelectedAttributes(prev =>
      prev.includes(attrId) ? prev.filter(a => a !== attrId) : [...prev, attrId]
    )
  }

  const getNextStep = (currentStep) => {
    const idx = STEPS.indexOf(currentStep)
    // Skip attributes step for common actions
    if (currentStep === 'type' && !isCustomAction) {
      return 'employees'
    }
    return STEPS[idx + 1]
  }

  const getPrevStep = (currentStep) => {
    const idx = STEPS.indexOf(currentStep)
    // Skip attributes step when going back for common actions
    if (currentStep === 'employees' && !isCustomAction) {
      return 'type'
    }
    return STEPS[idx - 1]
  }

  const canProceed = () => {
    if (step === 'type') return actionType !== null
    if (step === 'attributes') return selectedAttributes.length > 0
    if (step === 'employees') return selectedEmployees.length > 0
    if (step === 'changes') {
      if (changeMode === 'uniform') return Object.keys(uniformValues).length > 0
      return true
    }
    return true
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={resetAndClose} />

        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Action</h2>
              <p className="text-sm text-gray-500">
                {step === 'type' && 'Select the type of change'}
                {step === 'attributes' && 'Choose which attributes to update'}
                {step === 'employees' && 'Select employees to include'}
                {step === 'changes' && 'Specify the changes'}
                {step === 'confirm' && 'Review and confirm'}
              </p>
            </div>
            <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Action Type */}
            {step === 'type' && (
              <div className="grid grid-cols-2 gap-4">
                {COMMON_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => setActionType(action.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      actionType === action.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Attributes: {action.attributes.slice(0, 3).join(', ')}
                      {action.attributes.length > 3 && ` +${action.attributes.length - 3} more`}
                    </p>
                  </button>
                ))}
                {/* Custom Action Option */}
                <button
                  onClick={() => setActionType('custom')}
                  className={`p-4 rounded-lg border-2 text-left transition-all col-span-2 ${
                    actionType === 'custom'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-dashed border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Custom Attribute Update</h3>
                      <p className="text-sm text-gray-500">Select any combination of attributes to change</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Attribute Browser (Custom Action Only) */}
            {step === 'attributes' && (
              <div className="flex gap-6 h-96">
                {/* Category Sidebar */}
                <div className="w-56 border-r border-gray-200 pr-4 overflow-y-auto">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h4>
                  <div className="space-y-1">
                    {ATTRIBUTE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          activeCategory === cat.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedAttributes.some(a => cat.attributes.some(attr => attr.id === a)) && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attributes List */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      {ATTRIBUTE_CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {selectedAttributes.length} selected
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ATTRIBUTE_CATEGORIES.find(c => c.id === activeCategory)?.attributes
                      .filter(attr => attr.editable)
                      .map(attr => (
                        <label
                          key={attr.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAttributes.includes(attr.id)}
                            onChange={() => toggleAttribute(attr.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{attr.name}</p>
                            <p className="text-xs text-gray-500">Type: {attr.type}</p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Selected Summary */}
                {selectedAttributes.length > 0 && (
                  <div className="w-48 border-l border-gray-200 pl-4 overflow-y-auto">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Selected</h4>
                    <div className="space-y-2">
                      {selectedAttributes.map(attrId => {
                        const attr = getAttributeById(attrId)
                        return attr ? (
                          <div key={attrId} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{attr.name}</span>
                            <button
                              onClick={() => toggleAttribute(attrId)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Employee Selection */}
            {step === 'employees' && (
              <div>
                {/* Tabs */}
                <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
                  {[
                    { id: 'search', label: 'Search' },
                    { id: 'filter', label: 'Filters' },
                    { id: 'paste', label: 'Paste IDs' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setEmployeeTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        employeeTab === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-6">
                  {/* Left: Selection */}
                  <div className="flex-1">
                    {employeeTab === 'search' && (
                      <div>
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                          {filteredEmployees.slice(0, 50).map(emp => (
                            <label
                              key={emp.id}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedEmployees.some(e => e.id === emp.id)}
                                onChange={() => toggleEmployee(emp)}
                                className="rounded text-indigo-600"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.department} · {emp.title}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {employeeTab === 'filter' && (
                      <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                              value={filterDepartment}
                              onChange={(e) => setFilterDepartment(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">All departments</option>
                              {departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <select
                              value={filterLevel}
                              onChange={(e) => setFilterLevel(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">All levels</option>
                              {levels.map(l => (
                                <option key={l} value={l}>{l}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{filteredEmployees.length} employees match</span>
                          <button
                            onClick={selectAllFiltered}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Select all
                          </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                          {filteredEmployees.slice(0, 30).map(emp => (
                            <label
                              key={emp.id}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedEmployees.some(e => e.id === emp.id)}
                                onChange={() => toggleEmployee(emp)}
                                className="rounded text-indigo-600"
                              />
                              <span className="text-sm text-gray-900">{emp.name}</span>
                              <span className="text-xs text-gray-500">{emp.level}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {employeeTab === 'paste' && (
                      <div>
                        <textarea
                          placeholder="Paste employee emails or IDs, one per line or comma-separated"
                          value={pasteInput}
                          onChange={(e) => setPasteInput(e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                        />
                        {pasteInput && (
                          <div className="space-y-2">
                            {parsedPasteEmployees.matched.length > 0 && (
                              <div className="p-3 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-emerald-700">
                                  {parsedPasteEmployees.matched.length} employees matched
                                </p>
                                <button
                                  onClick={handleAddPasted}
                                  className="mt-2 text-sm text-emerald-600 font-medium hover:text-emerald-700"
                                >
                                  Add all matched
                                </button>
                              </div>
                            )}
                            {parsedPasteEmployees.unmatched.length > 0 && (
                              <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-700">
                                  {parsedPasteEmployees.unmatched.length} not found: {parsedPasteEmployees.unmatched.slice(0, 3).join(', ')}
                                  {parsedPasteEmployees.unmatched.length > 3 && '...'}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Selected */}
                  <div className="w-64">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Selected ({selectedEmployees.length})
                    </h4>
                    <div className="border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
                      {selectedEmployees.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400 text-center">No employees selected</p>
                      ) : (
                        selectedEmployees.map(emp => (
                          <div key={emp.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                            <span className="text-sm text-gray-900 truncate">{emp.name}</span>
                            <button
                              onClick={() => toggleEmployee(emp)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Changes */}
            {step === 'changes' && currentAttributes.length > 0 && (
              <div>
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setChangeMode('uniform')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      changeMode === 'uniform' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Same value for all
                  </button>
                  <button
                    onClick={() => setChangeMode('per-employee')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      changeMode === 'per-employee' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Different per employee
                  </button>
                </div>

                {changeMode === 'uniform' && (
                  <div className="space-y-4 max-w-md">
                    {currentAttributes.map(attr => (
                      <div key={attr}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {attr.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {attr === 'department' ? (
                          <select
                            value={uniformValues[attr] || ''}
                            onChange={(e) => setUniformValues(prev => ({ ...prev, [attr]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select...</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        ) : attr === 'level' ? (
                          <select
                            value={uniformValues[attr] || ''}
                            onChange={(e) => setUniformValues(prev => ({ ...prev, [attr]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select...</option>
                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        ) : attr === 'location' ? (
                          <select
                            value={uniformValues[attr] || ''}
                            onChange={(e) => setUniformValues(prev => ({ ...prev, [attr]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Select...</option>
                            {['San Francisco', 'Austin', 'New York', 'Seattle', 'Remote'].map(l => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                        ) : ['salary', 'bonusTarget', 'hourlyRate'].includes(attr) ? (
                          <input
                            type="number"
                            value={uniformValues[attr] || ''}
                            onChange={(e) => setUniformValues(prev => ({ ...prev, [attr]: Number(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter amount"
                          />
                        ) : (
                          <input
                            type="text"
                            value={uniformValues[attr] || ''}
                            onChange={(e) => setUniformValues(prev => ({ ...prev, [attr]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {changeMode === 'per-employee' && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-80">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                              Employee
                            </th>
                            {currentAttributes.flatMap(attr => [
                              <th key={`current-${attr}`} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                                {attr.replace(/([A-Z])/g, ' $1').trim()}
                              </th>,
                              <th key={`new-${attr}`} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-indigo-50">
                                New
                              </th>
                            ])}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedEmployees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 whitespace-nowrap sticky left-0 bg-white z-10">
                                <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                <div className="text-xs text-gray-500">{emp.department}</div>
                              </td>
                              {currentAttributes.flatMap(attr => [
                                <td key={`current-${attr}`} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-l border-gray-200">
                                  {['salary', 'bonusTarget', 'hourlyRate'].includes(attr) && emp[attr]
                                    ? `$${emp[attr].toLocaleString()}`
                                    : emp[attr] || '—'}
                                </td>,
                                <td key={`new-${attr}`} className="px-4 py-2 whitespace-nowrap bg-indigo-50/30">
                                  {['salary', 'bonusTarget', 'hourlyRate'].includes(attr) ? (
                                    <input
                                      type="number"
                                      value={perEmployeeValues[emp.id]?.[attr] ?? ''}
                                      onChange={(e) => setPerEmployeeValues(prev => ({
                                        ...prev,
                                        [emp.id]: {
                                          ...prev[emp.id],
                                          [attr]: e.target.value ? Number(e.target.value) : ''
                                        }
                                      }))}
                                      placeholder={emp[attr]?.toString() || ''}
                                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  ) : attr === 'department' ? (
                                    <select
                                      value={perEmployeeValues[emp.id]?.[attr] ?? ''}
                                      onChange={(e) => setPerEmployeeValues(prev => ({
                                        ...prev,
                                        [emp.id]: { ...prev[emp.id], [attr]: e.target.value }
                                      }))}
                                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                    >
                                      <option value="">No change</option>
                                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                  ) : attr === 'level' ? (
                                    <select
                                      value={perEmployeeValues[emp.id]?.[attr] ?? ''}
                                      onChange={(e) => setPerEmployeeValues(prev => ({
                                        ...prev,
                                        [emp.id]: { ...prev[emp.id], [attr]: e.target.value }
                                      }))}
                                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                    >
                                      <option value="">No change</option>
                                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                  ) : attr === 'location' ? (
                                    <select
                                      value={perEmployeeValues[emp.id]?.[attr] ?? ''}
                                      onChange={(e) => setPerEmployeeValues(prev => ({
                                        ...prev,
                                        [emp.id]: { ...prev[emp.id], [attr]: e.target.value }
                                      }))}
                                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                    >
                                      <option value="">No change</option>
                                      {['San Francisco', 'Austin', 'New York', 'Seattle', 'Remote'].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type="text"
                                      value={perEmployeeValues[emp.id]?.[attr] ?? ''}
                                      onChange={(e) => setPerEmployeeValues(prev => ({
                                        ...prev,
                                        [emp.id]: { ...prev[emp.id], [attr]: e.target.value }
                                      }))}
                                      placeholder={emp[attr]?.toString() || ''}
                                      className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                  )}
                                </td>
                              ])}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                      Leave fields empty to keep current value. {Object.keys(perEmployeeValues).filter(id =>
                        Object.values(perEmployeeValues[id] || {}).some(v => v !== '')
                      ).length} of {selectedEmployees.length} employees have changes.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Confirm */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Action Summary</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {isCustomAction ? 'Custom Attribute Update' : actionDef?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Employees:</strong> {selectedEmployees.length}
                  </p>
                  {isCustomAction && (
                    <p className="text-sm text-gray-600">
                      <strong>Attributes:</strong> {selectedAttributes.map(a => getAttributeById(a)?.name).filter(Boolean).join(', ')}
                    </p>
                  )}
                  {changeMode === 'uniform' && Object.keys(uniformValues).length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 font-medium">Changes (same for all):</p>
                      {Object.entries(uniformValues).map(([attr, val]) => (
                        <p key={attr} className="text-sm text-gray-600 ml-2">
                          • {attr}: {typeof val === 'number' ? `$${val.toLocaleString()}` : val}
                        </p>
                      ))}
                    </div>
                  )}
                  {changeMode === 'per-employee' && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 font-medium">Changes (per employee):</p>
                      <p className="text-sm text-gray-600 ml-2">
                        {Object.keys(perEmployeeValues).filter(id =>
                          Object.values(perEmployeeValues[id] || {}).some(v => v !== '' && v !== null && v !== undefined)
                        ).length} employees with custom values
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (step === 'type') resetAndClose()
                else setStep(getPrevStep(step))
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {step === 'type' ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={() => {
                if (step === 'confirm') handleSubmit()
                else setStep(getNextStep(step))
              }}
              disabled={!canProceed()}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 'confirm' ? 'Add Action' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
