// Pre-populated bulk change scenarios
import { employees, getSFEmployees, getEngineeringEmployees, KEY_PEOPLE } from './employees'

// Helper to get employees for scenarios
const getScenario1Employees = () => {
  // 85 engineering ICs for comp changes
  const engEmployees = employees.filter(e =>
    e.department === 'Engineering' &&
    ['L2', 'L3', 'L4', 'L5'].includes(e.level) &&
    e.title !== 'VP Engineering' &&
    !e.title.includes('Manager') &&
    !e.title.includes('Director')
  ).slice(0, 85)
  return engEmployees
}

const getScenario2Employees = () => {
  // 40 engineers for department transfers
  const engEmployees = employees.filter(e =>
    e.department === 'Engineering' &&
    ['L2', 'L3', 'L4', 'L5'].includes(e.level)
  ).slice(0, 40)
  return engEmployees
}

const getScenario3Employees = () => {
  // Matt Chen's 6 direct reports
  const mattChen = employees.find(e => e.firstName === 'Matt' && e.lastName === 'Chen')
  if (!mattChen) return employees.filter(e => e.department === 'Engineering').slice(0, 6)
  return employees.filter(e => e.managerId === mattChen.id).slice(0, 6)
}

const getScenario4Employees = () => {
  // All 220 SF employees
  return getSFEmployees()
}

// Generate comp changes for Scenario 1
const generateCompChanges = (emps) => {
  return emps.map(emp => {
    const raisePercent = Math.random() * 0.15 + 0.03 // 3-18% raise
    const newSalary = Math.round(emp.salary * (1 + raisePercent) / 1000) * 1000
    const newBonus = Math.round(newSalary * (emp.level === 'L5' ? 0.15 : 0.10))

    return {
      employeeId: emp.id,
      employee: emp,
      changes: {
        salary: { current: emp.salary, new: newSalary, delta: newSalary - emp.salary },
        bonusTarget: { current: emp.bonusTarget, new: newBonus, delta: newBonus - emp.bonusTarget },
      },
      validation: raisePercent > 0.20 ? {
        type: 'warning',
        code: 'large_change',
        message: `Salary increase of ${Math.round(raisePercent * 100)}% exceeds 20% threshold`,
      } : null,
    }
  })
}

// Generate title/level changes for promotions
const generatePromotions = (emps) => {
  const levelUp = { L2: 'L3', L3: 'L4', L4: 'L5', L5: 'L6' }
  const titleUp = {
    'Engineer': 'Senior Engineer',
    'Senior Engineer': 'Staff Engineer',
    'Staff Engineer': 'Principal Engineer',
  }

  return emps.slice(0, 12).map(emp => {
    const newLevel = levelUp[emp.level] || emp.level
    const currentTitleBase = emp.title.replace(/^(Senior |Staff |Principal |Lead |Associate |Junior )/, '')
    const newTitle = titleUp[emp.title] || `Senior ${currentTitleBase}`

    return {
      employeeId: emp.id,
      employee: emp,
      changes: {
        level: { current: emp.level, new: newLevel },
        title: { current: emp.title, new: newTitle },
      },
    }
  })
}

// Generate department transfers
const generateDeptTransfers = (emps, toDept) => {
  return emps.map(emp => ({
    employeeId: emp.id,
    employee: emp,
    changes: {
      department: { current: emp.department, new: toDept },
      costCenter: { current: emp.costCenter, new: `CC-${toDept.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}` },
    },
  }))
}

// Generate location changes for Scenario 4
const generateLocationChanges = (emps) => {
  return emps.map(emp => {
    const validation = []

    // Check for visa holders
    if (emp.visaType) {
      validation.push({
        type: 'error',
        code: 'visa_hold',
        message: `Employee on ${emp.visaType} visa requires legal review before location change`,
        blocking: true,
      })
    }

    // Check for employees on leave
    if (emp.onLeave) {
      validation.push({
        type: 'error',
        code: 'active_leave',
        message: `Employee on ${emp.leaveType} leave - employment terms cannot be changed`,
        blocking: true,
      })
    }

    // Check for hourly workers needing overtime review
    if (emp.isHourly) {
      validation.push({
        type: 'warning',
        code: 'overtime_review',
        message: 'Overtime eligibility requires re-evaluation under Texas law',
        blocking: false,
      })
    }

    // Benefits re-enrollment warning for CA employees
    if (emp.state === 'CA') {
      validation.push({
        type: 'warning',
        code: 'benefits_reenrollment',
        message: 'California-mandated benefits coverage ends - 30-day re-enrollment required',
        blocking: false,
      })
    }

    return {
      employeeId: emp.id,
      employee: emp,
      changes: {
        location: { current: emp.location, new: 'Austin' },
        city: { current: emp.city, new: 'Austin' },
        state: { current: emp.state, new: 'TX' },
        taxJurisdictionState: { current: 'CA', new: 'TX' },
        timezone: { current: emp.timezone, new: 'America/Chicago' },
      },
      validation: validation.length > 0 ? validation : null,
    }
  })
}

// Create the 4 pre-populated scenarios
export const createMockBulkChanges = () => {
  const scenario1Emps = getScenario1Employees()
  const scenario2Emps = getScenario2Employees()
  const scenario3Emps = getScenario3Employees()
  const scenario4Emps = getScenario4Employees()

  return [
    // Scenario 1: Q1 2026 Performance Cycle
    {
      id: 'bc-scenario-1',
      name: 'Q1 2026 Performance Cycle',
      description: 'Annual performance review compensation adjustments, promotions, and team transfers',
      status: 'draft',
      currentStep: 2,
      completedSteps: [1],
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-28T14:30:00Z',
      effectiveDate: '2026-02-01',
      employeeCount: 85,
      actions: [
        {
          id: 'action-1-1',
          type: 'update_compensation',
          name: 'Compensation Updates',
          employeeCount: 85,
          employees: generateCompChanges(scenario1Emps),
          summary: {
            minChange: 5000,
            maxChange: 25000,
            medianChange: 12000,
            totalAnnualImpact: 1200000,
          },
        },
        {
          id: 'action-1-2',
          type: 'update_title_level',
          name: 'Title & Level Updates',
          employeeCount: 12,
          employees: generatePromotions(scenario1Emps),
          summary: {
            promotions: 12,
            levelChanges: { 'L3→L4': 5, 'L4→L5': 4, 'L5→L6': 3 },
          },
        },
        {
          id: 'action-1-3',
          type: 'change_department',
          name: 'Department Transfers',
          employeeCount: 8,
          employees: generateDeptTransfers(scenario1Emps.slice(0, 8), 'AI/ML'),
          summary: {
            transfers: { 'Engineering → AI/ML': 8 },
          },
        },
      ],
      validation: {
        errors: 1,
        warnings: 2,
        info: 3,
        items: [
          { type: 'error', code: 'min_wage', message: '1 employee below CA minimum wage threshold', actionId: 'action-1-1' },
          { type: 'warning', code: 'large_change', message: '1 employee with >25% raise flagged for review', actionId: 'action-1-1' },
          { type: 'warning', code: 'scheduled_conflict', message: 'Scheduled job conflict with Q4 2025 adjustments', actionId: 'action-1-1' },
        ],
      },
      approvers: [
        {
          id: 'approver-1',
          scope: 'Comp Changes — Engineering ICs',
          employeeCount: 72,
          approver: KEY_PEOPLE.vpEngineering,
          backup: employees.find(e => e.title?.includes('Sr. Dir')),
          status: 'pending',
          sentAt: '2026-01-28T14:30:00Z',
          dueAt: '2026-01-31T23:59:59Z',
        },
        {
          id: 'approver-2',
          scope: 'Comp Changes — Directors',
          employeeCount: 13,
          approver: KEY_PEOPLE.ceo,
          backup: KEY_PEOPLE.coo,
          status: 'approved',
          approvedAt: '2026-01-29T09:15:00Z',
        },
      ],
    },

    // Scenario 2: Engineering Reorg
    {
      id: 'bc-scenario-2',
      name: 'Engineering Reorg — Feb 2026',
      description: 'Restructuring Engineering into Platform Engineering and AI/ML divisions',
      status: 'draft',
      currentStep: 2,
      completedSteps: [1],
      createdAt: '2026-01-10T09:00:00Z',
      updatedAt: '2026-01-25T16:45:00Z',
      effectiveDate: '2026-02-15',
      employeeCount: 40,
      actions: [
        {
          id: 'action-2-1',
          type: 'change_department',
          name: 'Transfer to Platform Engineering',
          employeeCount: 32,
          employees: generateDeptTransfers(scenario2Emps.slice(0, 32), 'Platform Engineering'),
          summary: {
            transfers: { 'Engineering → Platform Engineering': 32 },
          },
        },
        {
          id: 'action-2-2',
          type: 'change_department',
          name: 'Transfer to AI/ML',
          employeeCount: 8,
          employees: generateDeptTransfers(scenario2Emps.slice(32, 40), 'AI/ML'),
          summary: {
            transfers: { 'Engineering → AI/ML': 8 },
          },
        },
        {
          id: 'action-2-3',
          type: 'change_manager',
          name: 'Manager Changes',
          employeeCount: 15,
          employees: scenario2Emps.slice(0, 15).map(emp => ({
            employeeId: emp.id,
            employee: emp,
            changes: {
              managerId: { current: emp.managerId, new: KEY_PEOPLE.vpAIML?.id },
              managerName: { current: emp.managerName, new: KEY_PEOPLE.vpAIML?.name },
            },
          })),
          summary: {
            managerChanges: 15,
          },
        },
      ],
      validation: {
        errors: 1,
        warnings: 0,
        info: 1,
        dependencies: 1,
        items: [
          { type: 'error', code: 'circular_manager', message: 'Circular manager chain detected: Employee A → B → A', actionId: 'action-2-3' },
          { type: 'info', code: 'cost_center_info', message: 'Cost centers will be updated to reflect new department assignments', actionId: 'action-2-1' },
          {
            type: 'dependency',
            code: 'payroll_entity_change',
            message: 'Payroll entity change required',
            description: 'Employees moving to Platform Engineering and AI/ML will have their paychecks issued from a different legal entity. This requires coordination with Finance and Payroll teams.',
            actionId: 'action-2-1',
            count: 40,
            affectedSystem: 'Payroll',
            requiredAction: 'Finance team must update payroll entity assignments before effective date',
          },
        ],
      },
      approvers: [
        {
          id: 'approver-3',
          scope: 'Department Transfers',
          employeeCount: 40,
          approver: KEY_PEOPLE.vpEngineering,
          status: 'pending',
        },
        {
          id: 'approver-4',
          scope: 'Department Transfers (Gaining)',
          employeeCount: 8,
          approver: KEY_PEOPLE.vpAIML,
          status: 'pending',
        },
      ],
    },

    // Scenario 3: Manager Updates 6 Reports
    {
      id: 'bc-scenario-3',
      name: 'Manager Updates 6 Direct Reports Post-Review',
      description: 'Quick post-review adjustments for a small team',
      status: 'draft',
      currentStep: 2,
      completedSteps: [1],
      createdAt: '2026-01-30T11:00:00Z',
      updatedAt: '2026-01-30T11:15:00Z',
      effectiveDate: '2026-02-01',
      employeeCount: 6,
      actions: [
        {
          id: 'action-3-1',
          type: 'update_compensation',
          name: 'Compensation Updates',
          employeeCount: 6,
          employees: generateCompChanges(scenario3Emps),
          summary: {
            minChange: 3000,
            maxChange: 10000,
            medianChange: 6000,
            totalAnnualImpact: 42000,
          },
        },
        {
          id: 'action-3-2',
          type: 'update_title_level',
          name: 'Title Updates',
          employeeCount: 2,
          employees: generatePromotions(scenario3Emps).slice(0, 2),
          summary: {
            promotions: 2,
          },
        },
      ],
      validation: {
        errors: 0,
        warnings: 0,
        info: 0,
        items: [],
      },
      approvers: [
        {
          id: 'approver-3-1',
          scope: 'Compensation Changes',
          employeeCount: 6,
          approver: KEY_PEOPLE.cfo,
          backup: KEY_PEOPLE.coo,
          status: 'pending',
          sentAt: '2026-01-30T12:00:00Z',
          dueAt: '2026-02-03T23:59:59Z',
        },
        {
          id: 'approver-3-2',
          scope: 'Title & Level Changes',
          employeeCount: 2,
          approver: KEY_PEOPLE.vpHR,
          backup: employees.find(e => e.title === 'HR Director'),
          status: 'pending',
          sentAt: '2026-01-30T12:00:00Z',
          dueAt: '2026-02-03T23:59:59Z',
        },
      ],
    },

    // Scenario 4: SF Office Consolidation
    {
      id: 'bc-scenario-4',
      name: 'SF Office Consolidation to Austin — March 2026',
      description: '220 employees relocating from San Francisco to Austin office',
      status: 'draft',
      currentStep: 2,
      completedSteps: [1],
      createdAt: '2026-01-05T08:00:00Z',
      updatedAt: '2026-01-30T17:00:00Z',
      effectiveDate: '2026-03-01',
      employeeCount: scenario4Emps.length,
      actions: [
        {
          id: 'action-4-1',
          type: 'reassign_location',
          name: 'Location Changes',
          employeeCount: scenario4Emps.length,
          employees: generateLocationChanges(scenario4Emps),
          summary: {
            fromLocation: 'San Francisco',
            toLocation: 'Austin',
            taxJurisdictionChange: 'CA → TX',
            stateIncomeTaxImpact: 'Eliminated for all employees',
          },
        },
      ],
      validation: {
        errors: 14,
        warnings: 52,
        info: 5,
        items: [
          { type: 'error', code: 'visa_hold', message: '11 employees on work visas require legal review', actionId: 'action-4-1', count: 11 },
          { type: 'error', code: 'active_leave', message: '3 employees on active FMLA/disability leave cannot be moved', actionId: 'action-4-1', count: 3 },
          { type: 'warning', code: 'benefits_reenrollment', message: '34 employees lose CA-mandated benefits coverage - 30-day re-enrollment required', actionId: 'action-4-1', count: 34 },
          { type: 'warning', code: 'overtime_review', message: '18 hourly employees need overtime eligibility re-evaluation under TX law', actionId: 'action-4-1', count: 18 },
          { type: 'info', code: 'payroll_impact', message: 'All 220 employees will have payroll recalculated', actionId: 'action-4-1' },
        ],
      },
      approvers: [
        {
          id: 'approver-5',
          scope: 'Budget Impact (Tax Jurisdiction)',
          employeeCount: scenario4Emps.length,
          approver: KEY_PEOPLE.cfo,
          backup: KEY_PEOPLE.coo,
          status: 'pending',
        },
        {
          id: 'approver-6',
          scope: 'Visa Employees (11)',
          employeeCount: 11,
          approver: KEY_PEOPLE.vpLegal,
          status: 'pending',
        },
        {
          id: 'approver-7',
          scope: 'Badge Access',
          employeeCount: scenario4Emps.length,
          approver: employees.find(e => e.title === 'Director of Facilities'),
          status: 'pending',
        },
      ],
    },
  ]
}

export const mockBulkChanges = createMockBulkChanges()

export default mockBulkChanges
