// Employee attribute taxonomy organized by category
// ~100 attributes as specified in the spec

export const ATTRIBUTE_CATEGORIES = [
  {
    id: 'employment',
    name: 'Employment & Role',
    icon: 'briefcase',
    attributes: [
      { id: 'title', name: 'Job title', type: 'text', editable: true },
      { id: 'level', name: 'Level / band', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'], editable: true },
      { id: 'jobFamily', name: 'Job family / function', type: 'select', options: ['Engineering', 'Product', 'Design', 'Sales', 'Operations'], editable: true },
      { id: 'department', name: 'Department', type: 'select', options: ['Engineering', 'Platform Engineering', 'AI/ML', 'Product', 'Design', 'Sales', 'Marketing', 'Customer Support', 'HR', 'Finance', 'Legal', 'Operations'], editable: true },
      { id: 'division', name: 'Division', type: 'text', editable: true },
      { id: 'businessUnit', name: 'Business unit', type: 'text', editable: true },
      { id: 'team', name: 'Team', type: 'text', editable: true },
      { id: 'costCenter', name: 'Cost center', type: 'text', editable: true },
      { id: 'employeeId', name: 'Employee ID / badge number', type: 'text', editable: false },
      { id: 'employmentType', name: 'Employment type', type: 'select', options: ['full-time', 'part-time', 'contractor', 'intern', 'temp'], editable: true },
      { id: 'employmentStatus', name: 'Employment status', type: 'select', options: ['active', 'leave', 'suspended'], editable: true },
      { id: 'workerType', name: 'Worker type', type: 'select', options: ['W-2', '1099'], editable: true },
      { id: 'startDate', name: 'Start date', type: 'date', editable: false },
      { id: 'originalHireDate', name: 'Original hire date (for rehires)', type: 'date', editable: false },
      { id: 'probationEndDate', name: 'Probation end date', type: 'date', editable: true },
      { id: 'expectedEndDate', name: 'Expected end date (contractors/temps)', type: 'date', editable: true },
      { id: 'jobDescription', name: 'Job description', type: 'textarea', editable: true },
      { id: 'flsaStatus', name: 'FLSA status', type: 'select', options: ['exempt', 'non-exempt'], editable: true },
      { id: 'unionMembership', name: 'Union membership', type: 'text', editable: true },
      { id: 'positionCode', name: 'Position code', type: 'text', editable: true },
    ],
  },
  {
    id: 'reporting',
    name: 'Reporting & Organization',
    icon: 'users',
    attributes: [
      { id: 'managerId', name: 'Direct manager', type: 'employee', editable: true },
      { id: 'dottedLineManager', name: 'Dotted-line manager', type: 'employee', editable: true },
      { id: 'skipLevelManager', name: 'Skip-level manager', type: 'employee', editable: false, derived: true },
      { id: 'hrBusinessPartner', name: 'HR business partner', type: 'employee', editable: true },
      { id: 'executiveSponsor', name: 'Executive sponsor', type: 'employee', editable: true },
      { id: 'directReports', name: 'Direct reports', type: 'employees', editable: false, derived: true },
    ],
  },
  {
    id: 'compensation',
    name: 'Compensation',
    icon: 'dollar',
    attributes: [
      { id: 'salary', name: 'Base salary', type: 'currency', editable: true },
      { id: 'hourlyRate', name: 'Pay rate (hourly)', type: 'currency', editable: true },
      { id: 'payFrequency', name: 'Pay frequency', type: 'select', options: ['weekly', 'biweekly', 'semi-monthly', 'monthly'], editable: true },
      { id: 'currency', name: 'Pay currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'CAD'], editable: true },
      { id: 'bonusTarget', name: 'Target annual bonus', type: 'currency', editable: true },
      { id: 'bonusStructure', name: 'Bonus structure / plan', type: 'text', editable: true },
      { id: 'commissionPlan', name: 'Commission plan', type: 'text', editable: true },
      { id: 'commissionRate', name: 'Commission rate', type: 'percent', editable: true },
      { id: 'equityShares', name: 'Equity — stock options (grant count)', type: 'number', editable: true },
      { id: 'rsuGrants', name: 'Equity — RSU grants', type: 'number', editable: true },
      { id: 'vestingSchedule', name: 'Equity — vesting schedule', type: 'text', editable: true },
      { id: 'signOnBonus', name: 'Sign-on bonus', type: 'currency', editable: true },
      { id: 'retentionBonus', name: 'Retention bonus', type: 'currency', editable: true },
      { id: 'relocationAllowance', name: 'Relocation allowance', type: 'currency', editable: true },
      { id: 'stipend', name: 'Stipend (home office, wellness, education)', type: 'currency', editable: true },
      { id: 'totalTargetComp', name: 'Total target compensation', type: 'currency', editable: false, derived: true },
      { id: 'compBandMin', name: 'Comp band minimum', type: 'currency', editable: false },
      { id: 'compBandMax', name: 'Comp band maximum', type: 'currency', editable: false },
      { id: 'compBandMid', name: 'Comp band midpoint', type: 'currency', editable: false },
      { id: 'compaRatio', name: 'Compa-ratio', type: 'percent', editable: false, derived: true },
    ],
  },
  {
    id: 'location',
    name: 'Location & Workplace',
    icon: 'map',
    attributes: [
      { id: 'location', name: 'Work location (office name)', type: 'select', options: ['San Francisco', 'Austin', 'New York', 'Seattle', 'Remote'], editable: true },
      { id: 'workAddress', name: 'Work address', type: 'address', editable: true },
      { id: 'city', name: 'City', type: 'text', editable: true },
      { id: 'state', name: 'State/Province', type: 'text', editable: true },
      { id: 'country', name: 'Country', type: 'text', editable: true },
      { id: 'taxJurisdictionState', name: 'Tax jurisdiction — state', type: 'text', editable: false, derived: true, derivedFrom: 'location' },
      { id: 'taxJurisdictionLocal', name: 'Tax jurisdiction — local', type: 'text', editable: false, derived: true },
      { id: 'taxJurisdictionCountry', name: 'Tax jurisdiction — country', type: 'text', editable: false, derived: true },
      { id: 'homeAddress', name: 'Home address', type: 'address', editable: true },
      { id: 'workArrangement', name: 'Work arrangement', type: 'select', options: ['onsite', 'hybrid', 'remote'], editable: true },
      { id: 'timezone', name: 'Time zone', type: 'select', options: ['America/Los_Angeles', 'America/Chicago', 'America/New_York', 'America/Denver'], editable: true },
      { id: 'officeFloor', name: 'Default office floor / desk / zone', type: 'text', editable: true },
    ],
  },
  {
    id: 'schedule',
    name: 'Time & Schedule',
    icon: 'clock',
    attributes: [
      { id: 'workSchedule', name: 'Work schedule', type: 'text', editable: true },
      { id: 'hoursPerWeek', name: 'Hours per week', type: 'number', editable: true },
      { id: 'shiftAssignment', name: 'Shift assignment', type: 'text', editable: true },
      { id: 'overtimeEligibility', name: 'Overtime eligibility', type: 'boolean', editable: true },
      { id: 'ptoPolicy', name: 'PTO policy', type: 'select', options: ['Standard', 'Unlimited', 'Accrued'], editable: true },
      { id: 'sickLeavePolicy', name: 'Sick leave policy', type: 'text', editable: true },
      { id: 'holidayCalendar', name: 'Holiday calendar', type: 'select', options: ['US Standard', 'US + Floating', 'Global'], editable: true },
      { id: 'timeOffAccrualRate', name: 'Time-off accrual rate', type: 'number', editable: true },
    ],
  },
  {
    id: 'personal',
    name: 'Personal & Identity',
    icon: 'user',
    attributes: [
      { id: 'firstName', name: 'Legal first name', type: 'text', editable: true },
      { id: 'lastName', name: 'Legal last name', type: 'text', editable: true },
      { id: 'preferredName', name: 'Preferred first name (display name)', type: 'text', editable: true },
      { id: 'pronouns', name: 'Preferred pronouns', type: 'select', options: ['he/him', 'she/her', 'they/them', 'other'], editable: true },
      { id: 'dateOfBirth', name: 'Date of birth', type: 'date', editable: true, sensitive: true },
      { id: 'gender', name: 'Gender', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], editable: true },
      { id: 'ethnicity', name: 'Ethnicity (voluntary self-ID, EEO)', type: 'text', editable: true },
      { id: 'veteranStatus', name: 'Veteran status (voluntary self-ID)', type: 'boolean', editable: true },
      { id: 'disabilityStatus', name: 'Disability status (voluntary self-ID)', type: 'boolean', editable: true },
      { id: 'maritalStatus', name: 'Marital status', type: 'select', options: ['Single', 'Married', 'Domestic Partnership', 'Divorced', 'Widowed'], editable: true },
      { id: 'ssn', name: 'SSN / national ID', type: 'text', editable: true, sensitive: true, masked: true },
      { id: 'citizenship', name: 'Citizenship', type: 'text', editable: true },
      { id: 'visaType', name: 'Work authorization type (visa type)', type: 'select', options: ['H-1B', 'L-1', 'O-1', 'TN', 'Green Card', 'Citizen', null], editable: true },
      { id: 'visaExpiry', name: 'Work authorization expiry date', type: 'date', editable: true },
      { id: 'emergencyContactName', name: 'Emergency contact — name', type: 'text', editable: true },
      { id: 'emergencyContactPhone', name: 'Emergency contact — phone', type: 'phone', editable: true },
      { id: 'emergencyContactRelationship', name: 'Emergency contact — relationship', type: 'text', editable: true },
      { id: 'personalEmail', name: 'Personal email', type: 'email', editable: true },
      { id: 'personalPhone', name: 'Personal phone', type: 'phone', editable: true },
    ],
  },
  {
    id: 'contact',
    name: 'Work Contact & Access',
    icon: 'at',
    attributes: [
      { id: 'email', name: 'Work email', type: 'email', editable: true },
      { id: 'workPhone', name: 'Work phone', type: 'phone', editable: true },
      { id: 'workMobile', name: 'Work mobile', type: 'phone', editable: true },
      { id: 'slackHandle', name: 'Slack handle / ID', type: 'text', editable: true },
      { id: 'githubUsername', name: 'GitHub username', type: 'text', editable: true },
      { id: 'googleWorkspace', name: 'Google Workspace account', type: 'email', editable: true },
      { id: 'microsoft365', name: 'Microsoft 365 account', type: 'email', editable: true },
      { id: 'badgeId', name: 'Badge / keycard ID', type: 'text', editable: true },
      { id: 'vpnAccessGroup', name: 'VPN access group', type: 'text', editable: true },
      { id: 'buildingAccessGroup', name: 'Building access group', type: 'text', editable: true },
    ],
  },
  {
    id: 'devices',
    name: 'IT & Devices',
    icon: 'laptop',
    attributes: [
      { id: 'assignedLaptop', name: 'Assigned laptop (asset tag)', type: 'text', editable: true },
      { id: 'assignedMobile', name: 'Assigned mobile device (asset tag)', type: 'text', editable: true },
      { id: 'assignedMonitors', name: 'Assigned monitor(s)', type: 'text', editable: true },
      { id: 'softwareLicenseGroup', name: 'Software license group', type: 'text', editable: true },
      { id: 'securityClearanceLevel', name: 'Security clearance level', type: 'select', options: ['None', 'Confidential', 'Secret', 'Top Secret'], editable: true },
      { id: 'mfaEnrollmentStatus', name: 'MFA enrollment status', type: 'boolean', editable: false },
      { id: 'deviceManagementPolicy', name: 'Device management policy group', type: 'text', editable: true },
    ],
  },
  {
    id: 'benefits',
    name: 'Benefits & Payroll',
    icon: 'heart',
    attributes: [
      { id: 'benefitsEligibilityGroup', name: 'Benefits eligibility group', type: 'select', options: ['salaried', 'hourly', 'contractor', 'intern'], editable: true },
      { id: 'medicalPlan', name: 'Medical plan', type: 'select', options: ['PPO Gold', 'PPO Silver', 'HMO', 'HDHP', 'None'], editable: true },
      { id: 'dentalPlan', name: 'Dental plan', type: 'select', options: ['Basic', 'Premium', 'None'], editable: true },
      { id: 'visionPlan', name: 'Vision plan', type: 'select', options: ['Basic', 'Premium', 'None'], editable: true },
      { id: 'lifePlan', name: 'Life insurance plan', type: 'select', options: ['1x Salary', '2x Salary', 'None'], editable: true },
      { id: 'retirementPlan', name: '401(k) / retirement plan', type: 'select', options: ['Traditional 401(k)', 'Roth 401(k)', 'None'], editable: true },
      { id: 'retirementContribution', name: '401(k) contribution % (employee)', type: 'percent', editable: true },
      { id: 'fsaHsa', name: 'FSA / HSA enrollment', type: 'select', options: ['FSA', 'HSA', 'None'], editable: true },
      { id: 'commuterBenefits', name: 'Commuter benefits', type: 'boolean', editable: true },
      { id: 'bankAccount', name: 'Bank account (direct deposit)', type: 'text', editable: true, sensitive: true, masked: true },
      { id: 'taxFilingFederal', name: 'Tax filing status (federal)', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'], editable: true },
      { id: 'taxFilingState', name: 'Tax filing status (state)', type: 'text', editable: true },
      { id: 'w4Allowances', name: 'W-4 allowances / withholding', type: 'number', editable: true },
      { id: 'stateWithholding', name: 'State tax withholding', type: 'currency', editable: true },
    ],
  },
  {
    id: 'custom',
    name: 'Custom & Company-Specific',
    icon: 'tag',
    attributes: [
      { id: 'customField1', name: 'Custom field 1', type: 'text', editable: true },
      { id: 'customField2', name: 'Custom field 2', type: 'text', editable: true },
      { id: 'customField3', name: 'Custom field 3', type: 'text', editable: true },
      { id: 'tags', name: 'Tags / labels', type: 'tags', editable: true },
      { id: 'notes', name: 'Notes (free text)', type: 'textarea', editable: true },
      { id: 'groupMemberships', name: 'Employee group memberships', type: 'tags', editable: true },
    ],
  },
]

// Common action types with their scoped attributes
export const COMMON_ACTIONS = [
  {
    id: 'update_compensation',
    name: 'Update Compensation',
    icon: 'dollar',
    description: 'Annual review raises, bonus adjustments, equity grants',
    attributes: ['salary', 'hourlyRate', 'bonusTarget', 'equityShares', 'payFrequency', 'currency'],
    color: 'emerald',
  },
  {
    id: 'change_department',
    name: 'Change Department',
    icon: 'building',
    description: 'Reorg, team restructure',
    attributes: ['department', 'costCenter', 'team'],
    color: 'blue',
  },
  {
    id: 'change_manager',
    name: 'Change Manager',
    icon: 'users',
    description: 'Reporting structure changes',
    attributes: ['managerId', 'dottedLineManager'],
    color: 'purple',
  },
  {
    id: 'reassign_location',
    name: 'Reassign Office / Location',
    icon: 'map',
    description: 'Office move, consolidation, remote transition',
    attributes: ['location', 'workAddress', 'city', 'state', 'workArrangement', 'timezone'],
    derivedAttributes: ['taxJurisdictionState', 'taxJurisdictionLocal'],
    color: 'orange',
  },
  {
    id: 'update_title_level',
    name: 'Update Title & Level',
    icon: 'trending-up',
    description: 'Promotions, title changes',
    attributes: ['title', 'level', 'jobFamily'],
    color: 'pink',
  },
  {
    id: 'change_team',
    name: 'Change Team',
    icon: 'users',
    description: 'Team restructure',
    attributes: ['team'],
    color: 'cyan',
  },
  {
    id: 'update_schedule',
    name: 'Update Work Schedule',
    icon: 'clock',
    description: 'Employment type changes, hours, shifts',
    attributes: ['employmentType', 'hoursPerWeek', 'shiftAssignment', 'workArrangement', 'workSchedule'],
    color: 'amber',
  },
]

// Helper functions
export const getAttributeById = (id) => {
  for (const category of ATTRIBUTE_CATEGORIES) {
    const attr = category.attributes.find(a => a.id === id)
    if (attr) return { ...attr, category: category.name }
  }
  return null
}

export const getAttributesByIds = (ids) => {
  return ids.map(id => getAttributeById(id)).filter(Boolean)
}

export const getActionAttributes = (actionType) => {
  const action = COMMON_ACTIONS.find(a => a.id === actionType)
  if (!action) return []
  return getAttributesByIds(action.attributes)
}

export const getCategoryById = (categoryId) => {
  return ATTRIBUTE_CATEGORIES.find(c => c.id === categoryId)
}

export default ATTRIBUTE_CATEGORIES
