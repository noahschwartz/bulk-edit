import { createContext, useContext, useState, useCallback } from 'react'

const BulkChangeContext = createContext(null)

// Initial state for a new bulk change
const createInitialBulkChange = (data) => ({
  id: crypto.randomUUID(),
  name: data.name || '',
  description: data.description || '',
  status: 'draft',
  actions: [],
  effectiveDate: null,
  reason: '',
  approvals: [],
  currentStep: 2, // Start at "Build Actions" since "Create" is already done
  completedSteps: [1], // Mark "Create" as completed
  employeeCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export function BulkChangeProvider({ children, initialData = [] }) {
  const [bulkChanges, setBulkChanges] = useState(initialData)

  // Create a new bulk change
  const createBulkChange = useCallback((data) => {
    const newBulkChange = createInitialBulkChange(data)
    setBulkChanges((prev) => [newBulkChange, ...prev])
    return newBulkChange
  }, [])

  // Get a bulk change by ID
  const getBulkChange = useCallback((id) => {
    return bulkChanges.find((bc) => bc.id === id)
  }, [bulkChanges])

  // Update a bulk change
  const updateBulkChange = useCallback((id, updates) => {
    setBulkChanges((prev) =>
      prev.map((bc) =>
        bc.id === id
          ? { ...bc, ...updates, updatedAt: new Date().toISOString() }
          : bc
      )
    )
  }, [])

  // Delete a bulk change
  const deleteBulkChange = useCallback((id) => {
    setBulkChanges((prev) => prev.filter((bc) => bc.id !== id))
  }, [])

  // Add an action to a bulk change
  const addAction = useCallback((bulkChangeId, action) => {
    setBulkChanges((prev) =>
      prev.map((bc) => {
        if (bc.id !== bulkChangeId) return bc

        const newAction = {
          id: crypto.randomUUID(),
          ...action,
          createdAt: new Date().toISOString(),
        }

        const updatedActions = [...bc.actions, newAction]

        // Recalculate employee count (deduplicated)
        const allEmployeeIds = new Set()
        updatedActions.forEach((a) => {
          a.employees?.forEach((emp) => allEmployeeIds.add(emp.employeeId || emp.id))
        })

        return {
          ...bc,
          actions: updatedActions,
          employeeCount: allEmployeeIds.size,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  // Update an action
  const updateAction = useCallback((bulkChangeId, actionId, updates) => {
    setBulkChanges((prev) =>
      prev.map((bc) => {
        if (bc.id !== bulkChangeId) return bc

        const updatedActions = bc.actions.map((action) =>
          action.id === actionId ? { ...action, ...updates } : action
        )

        // Recalculate employee count
        const allEmployeeIds = new Set()
        updatedActions.forEach((a) => {
          a.employees?.forEach((emp) => allEmployeeIds.add(emp.employeeId || emp.id))
        })

        return {
          ...bc,
          actions: updatedActions,
          employeeCount: allEmployeeIds.size,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  // Remove an action
  const removeAction = useCallback((bulkChangeId, actionId) => {
    setBulkChanges((prev) =>
      prev.map((bc) => {
        if (bc.id !== bulkChangeId) return bc

        const updatedActions = bc.actions.filter((a) => a.id !== actionId)

        // Recalculate employee count
        const allEmployeeIds = new Set()
        updatedActions.forEach((a) => {
          a.employees?.forEach((emp) => allEmployeeIds.add(emp.employeeId || emp.id))
        })

        return {
          ...bc,
          actions: updatedActions,
          employeeCount: allEmployeeIds.size,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  // Advance to next step
  const advanceStep = useCallback((bulkChangeId) => {
    setBulkChanges((prev) =>
      prev.map((bc) => {
        if (bc.id !== bulkChangeId) return bc

        const completedSteps = bc.completedSteps.includes(bc.currentStep)
          ? bc.completedSteps
          : [...bc.completedSteps, bc.currentStep]

        return {
          ...bc,
          currentStep: Math.min(bc.currentStep + 1, 7),
          completedSteps,
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }, [])

  // Go to specific step
  const goToStep = useCallback((bulkChangeId, step) => {
    setBulkChanges((prev) =>
      prev.map((bc) =>
        bc.id === bulkChangeId
          ? { ...bc, currentStep: step, updatedAt: new Date().toISOString() }
          : bc
      )
    )
  }, [])

  const value = {
    bulkChanges,
    setBulkChanges,
    createBulkChange,
    getBulkChange,
    updateBulkChange,
    deleteBulkChange,
    addAction,
    updateAction,
    removeAction,
    advanceStep,
    goToStep,
  }

  return (
    <BulkChangeContext.Provider value={value}>
      {children}
    </BulkChangeContext.Provider>
  )
}

export function useBulkChanges() {
  const context = useContext(BulkChangeContext)
  if (!context) {
    throw new Error('useBulkChanges must be used within a BulkChangeProvider')
  }
  return context
}

export default BulkChangeContext
