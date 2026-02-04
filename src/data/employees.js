// Generate 220+ mock employees for all 4 scenarios
// Includes: SF/Austin locations, visa holders, employees on leave, hourly workers

const DEPARTMENTS = [
  'Engineering',
  'Platform Engineering',
  'AI/ML',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'Customer Support',
  'HR',
  'Finance',
  'Legal',
  'Operations',
]

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']
const LEVEL_TITLES = {
  L1: ['Associate', 'Junior'],
  L2: ['', 'Mid-level'],
  L3: ['Senior'],
  L4: ['Staff', 'Lead'],
  L5: ['Senior Staff', 'Principal'],
  L6: ['Director', 'Senior Director'],
  L7: ['VP', 'Senior VP'],
}

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Wei', 'Priya', 'Raj', 'Aisha', 'Carlos', 'Yuki', 'Ahmed', 'Fatima', 'Chen', 'Mei',
  'Sanjay', 'Ananya', 'Dmitri', 'Olga', 'Hiroshi', 'Sakura', 'Ali', 'Zara', 'Jin', 'Min',
  'Arjun', 'Deepa', 'Viktor', 'Elena', 'Kenji', 'Yui', 'Hassan', 'Layla', 'Ravi', 'Kavita',
]

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Chen', 'Wang', 'Zhang', 'Liu', 'Huang', 'Kim', 'Park', 'Choi', 'Patel', 'Shah',
  'Kumar', 'Singh', 'Sharma', 'Gupta', 'Tanaka', 'Yamamoto', 'Sato', 'Suzuki',
  'Nguyen', 'Tran', 'Le', 'Pham', 'Mueller', 'Schmidt', 'Schneider', 'Fischer',
  'Petrov', 'Ivanov', 'Kowalski', 'Nowak', 'Santos', 'Ferreira', 'Costa', 'Silva',
]

const LOCATIONS = {
  'San Francisco': { state: 'CA', timezone: 'America/Los_Angeles' },
  'Austin': { state: 'TX', timezone: 'America/Chicago' },
  'New York': { state: 'NY', timezone: 'America/New_York' },
  'Seattle': { state: 'WA', timezone: 'America/Los_Angeles' },
  'Remote': { state: null, timezone: null },
}

const VISA_TYPES = ['H-1B', 'L-1', 'O-1', 'TN', null]

// Helper to generate random data
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomSalary = (level) => {
  const bases = { L1: 70000, L2: 90000, L3: 120000, L4: 150000, L5: 180000, L6: 220000, L7: 280000 }
  const base = bases[level] || 100000
  return Math.round((base + randomBetween(-15000, 25000)) / 1000) * 1000
}

// Generate employees
const generateEmployees = () => {
  const employees = []
  let id = 1

  // Helper to create an employee
  const createEmployee = (overrides = {}) => {
    const firstName = overrides.firstName || randomFrom(FIRST_NAMES)
    const lastName = overrides.lastName || randomFrom(LAST_NAMES)
    const department = overrides.department || randomFrom(DEPARTMENTS)
    const level = overrides.level || randomFrom(LEVELS)
    const location = overrides.location || randomFrom(Object.keys(LOCATIONS))
    const locationData = LOCATIONS[location]
    const salary = overrides.salary || randomSalary(level)
    const isHourly = overrides.isHourly || false
    const hourlyRate = isHourly ? Math.round(salary / 2080 * 100) / 100 : null

    const employee = {
      id: `EMP${String(id++).padStart(4, '0')}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      level,
      title: overrides.title || `${randomFrom(LEVEL_TITLES[level] || [''])} ${department === 'Engineering' || department === 'Platform Engineering' || department === 'AI/ML' ? 'Engineer' : department === 'Design' ? 'Designer' : department === 'Product' ? 'Product Manager' : 'Specialist'}`.trim(),
      location,
      workAddress: location === 'Remote' ? null : `${randomBetween(100, 999)} ${randomFrom(['Main', 'Market', 'Mission', 'Howard', 'Folsom'])} St`,
      city: location === 'Remote' ? null : location,
      state: locationData.state,
      country: 'USA',
      timezone: locationData.timezone || 'America/Los_Angeles',

      // Compensation
      salary,
      isHourly,
      hourlyRate,
      payFrequency: isHourly ? 'biweekly' : 'semi-monthly',
      currency: 'USD',
      bonusTarget: isHourly ? 0 : Math.round(salary * (level === 'L6' || level === 'L7' ? 0.25 : level === 'L4' || level === 'L5' ? 0.15 : 0.10)),
      equityShares: level === 'L7' ? randomBetween(50000, 100000) : level === 'L6' ? randomBetween(20000, 50000) : level === 'L5' ? randomBetween(10000, 25000) : level === 'L4' ? randomBetween(5000, 15000) : randomBetween(1000, 5000),

      // Manager
      managerId: overrides.managerId || null,
      managerName: overrides.managerName || null,

      // Status
      employmentType: isHourly ? 'hourly' : 'salaried',
      employmentStatus: overrides.employmentStatus || 'active',
      visaType: overrides.visaType || null,
      visaExpiry: overrides.visaExpiry || null,
      onLeave: overrides.onLeave || false,
      leaveType: overrides.leaveType || null,

      // Dates
      startDate: overrides.startDate || `${randomBetween(2018, 2025)}-${String(randomBetween(1, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,

      // Benefits
      benefitsEligibilityGroup: isHourly ? 'hourly' : 'salaried',
      medicalPlan: randomFrom(['PPO Gold', 'PPO Silver', 'HMO', 'HDHP']),

      // Cost center
      costCenter: `CC-${department.substring(0, 3).toUpperCase()}-${randomBetween(100, 999)}`,
    }

    return employee
  }

  // Create leadership/managers first
  const vpEng = createEmployee({ firstName: 'Sarah', lastName: 'Kim', department: 'Engineering', level: 'L7', title: 'VP Engineering', location: 'San Francisco' })
  const vpAIML = createEmployee({ firstName: 'Raj', lastName: 'Patel', department: 'AI/ML', level: 'L7', title: 'VP AI/ML', location: 'San Francisco' })
  const vpPlatform = createEmployee({ firstName: 'James', lastName: 'Wu', department: 'Platform Engineering', level: 'L6', title: 'Sr. Director Platform Engineering', location: 'San Francisco' })
  const ceo = createEmployee({ firstName: 'David', lastName: 'Park', department: 'Executive', level: 'L7', title: 'CEO', location: 'San Francisco' })
  const coo = createEmployee({ firstName: 'Lisa', lastName: 'Chen', department: 'Operations', level: 'L7', title: 'COO', location: 'San Francisco' })
  const cfo = createEmployee({ firstName: 'Michael', lastName: 'Torres', department: 'Finance', level: 'L7', title: 'CFO', location: 'San Francisco' })
  const vpLegal = createEmployee({ firstName: 'Amanda', lastName: 'Foster', department: 'Legal', level: 'L7', title: 'VP Legal', location: 'San Francisco' })
  const facilitiesDir = createEmployee({ firstName: 'Robert', lastName: 'Chang', department: 'Operations', level: 'L6', title: 'Director of Facilities', location: 'San Francisco' })

  employees.push(vpEng, vpAIML, vpPlatform, ceo, coo, cfo, vpLegal, facilitiesDir)

  // Department managers for all departments
  const deptManagers = {
    'Engineering': vpEng,
    'Platform Engineering': vpPlatform,
    'AI/ML': vpAIML,
    'Operations': coo,
    'Finance': cfo,
    'Legal': vpLegal,
  }

  // Create managers for other departments
  const vpProduct = createEmployee({ firstName: 'Jennifer', lastName: 'Martinez', department: 'Product', level: 'L6', title: 'VP Product', location: 'San Francisco', managerId: ceo.id, managerName: ceo.name })
  const vpDesign = createEmployee({ firstName: 'Alex', lastName: 'Rivera', department: 'Design', level: 'L6', title: 'VP Design', location: 'San Francisco', managerId: ceo.id, managerName: ceo.name })
  const vpSales = createEmployee({ firstName: 'Marcus', lastName: 'Johnson', department: 'Sales', level: 'L6', title: 'VP Sales', location: 'San Francisco', managerId: ceo.id, managerName: ceo.name })
  const vpMarketing = createEmployee({ firstName: 'Rachel', lastName: 'Wong', department: 'Marketing', level: 'L6', title: 'VP Marketing', location: 'San Francisco', managerId: ceo.id, managerName: ceo.name })
  const vpSupport = createEmployee({ firstName: 'Kevin', lastName: 'O\'Brien', department: 'Customer Support', level: 'L6', title: 'VP Customer Support', location: 'San Francisco', managerId: coo.id, managerName: coo.name })
  const vpHR = createEmployee({ firstName: 'Diana', lastName: 'Campbell', department: 'HR', level: 'L6', title: 'VP HR', location: 'San Francisco', managerId: ceo.id, managerName: ceo.name })

  employees.push(vpProduct, vpDesign, vpSales, vpMarketing, vpSupport, vpHR)

  deptManagers['Product'] = vpProduct
  deptManagers['Design'] = vpDesign
  deptManagers['Sales'] = vpSales
  deptManagers['Marketing'] = vpMarketing
  deptManagers['Customer Support'] = vpSupport
  deptManagers['HR'] = vpHR

  // Create mid-level managers for larger departments
  const productManagers = []
  for (let i = 0; i < 3; i++) {
    const mgr = createEmployee({
      department: 'Product',
      level: 'L5',
      title: 'Senior Product Manager',
      location: 'San Francisco',
      managerId: vpProduct.id,
      managerName: vpProduct.name,
    })
    productManagers.push(mgr)
    employees.push(mgr)
  }

  // Engineering managers
  const engManagers = []
  for (let i = 0; i < 8; i++) {
    const mgr = createEmployee({
      department: 'Engineering',
      level: randomFrom(['L5', 'L6']),
      title: randomFrom(['Engineering Manager', 'Senior Engineering Manager']),
      location: 'San Francisco',
      managerId: vpEng.id,
      managerName: vpEng.name,
    })
    engManagers.push(mgr)
    employees.push(mgr)
  }

  // === SCENARIO 1: Q1 2026 Performance Cycle ===
  // 85 comp changes needed - create Engineering ICs
  for (let i = 0; i < 85; i++) {
    const manager = randomFrom(engManagers)
    const level = randomFrom(['L2', 'L3', 'L4', 'L5'])
    const isHourly = i < 5 // A few hourly workers
    const emp = createEmployee({
      department: 'Engineering',
      level,
      location: 'San Francisco',
      managerId: manager.id,
      managerName: manager.name,
      isHourly,
    })
    employees.push(emp)
  }

  // 12 promotions - these will also be in the comp changes
  // (already included above, just need to mark some for title changes)

  // 8 department transfers (Eng → AI/ML) - create AI/ML team
  for (let i = 0; i < 15; i++) {
    const emp = createEmployee({
      department: 'AI/ML',
      level: randomFrom(['L3', 'L4', 'L5']),
      location: 'San Francisco',
      managerId: vpAIML.id,
      managerName: vpAIML.name,
    })
    employees.push(emp)
  }

  // === SCENARIO 2: Engineering Reorg ===
  // Need 40 engineers to transfer, 15 manager changes
  // These are already created above in the Eng team

  // === SCENARIO 3: Manager Updates 6 Reports ===
  // A manager with exactly 6 direct reports
  const smallTeamManager = createEmployee({
    firstName: 'Matt',
    lastName: 'Chen',
    department: 'Engineering',
    level: 'L5',
    title: 'Engineering Manager',
    location: 'San Francisco',
    managerId: vpEng.id,
    managerName: vpEng.name,
  })
  employees.push(smallTeamManager)

  for (let i = 0; i < 6; i++) {
    const emp = createEmployee({
      department: 'Engineering',
      level: randomFrom(['L2', 'L3', 'L4']),
      location: 'San Francisco',
      managerId: smallTeamManager.id,
      managerName: smallTeamManager.name,
    })
    employees.push(emp)
  }

  // === SCENARIO 4: SF Office Consolidation to Austin ===
  // 220 SF employees moving to Austin
  // Need: 11 visa holders, 3 on leave, 18 hourly, 34 needing benefits re-enrollment

  // Add more SF employees to get to 220 total SF
  const currentSFCount = employees.filter(e => e.location === 'San Francisco').length
  const neededSF = 220 - currentSFCount

  for (let i = 0; i < neededSF; i++) {
    const dept = randomFrom(DEPARTMENTS)
    const level = randomFrom(['L2', 'L3', 'L4', 'L5'])
    const manager = deptManagers[dept] || coo

    // Visa holders (11 total)
    const isVisaHolder = i < 11
    const visaType = isVisaHolder ? randomFrom(['H-1B', 'L-1', 'O-1']) : null
    const visaExpiry = isVisaHolder ? `2026-${String(randomBetween(6, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}` : null

    // On leave (3 total)
    const onLeave = i >= 11 && i < 14
    const leaveType = onLeave ? randomFrom(['FMLA', 'Disability', 'Medical']) : null
    const employmentStatus = onLeave ? 'leave' : 'active'

    // Hourly workers (18 total)
    const isHourly = i >= 14 && i < 32

    const emp = createEmployee({
      department: dept,
      level,
      location: 'San Francisco',
      visaType,
      visaExpiry,
      onLeave,
      leaveType,
      employmentStatus,
      isHourly,
      managerId: manager.id,
      managerName: manager.name,
    })
    employees.push(emp)
  }

  // Add some Austin employees (existing, not moving)
  for (let i = 0; i < 30; i++) {
    const dept = randomFrom(DEPARTMENTS)
    const manager = deptManagers[dept] || coo
    const emp = createEmployee({
      department: dept,
      level: randomFrom(['L2', 'L3', 'L4', 'L5']),
      location: 'Austin',
      managerId: manager.id,
      managerName: manager.name,
    })
    employees.push(emp)
  }

  // Add other locations for variety
  for (let i = 0; i < 20; i++) {
    const dept = randomFrom(DEPARTMENTS)
    const manager = deptManagers[dept] || coo
    const emp = createEmployee({
      department: dept,
      level: randomFrom(['L2', 'L3', 'L4']),
      location: randomFrom(['New York', 'Seattle', 'Remote']),
      managerId: manager.id,
      managerName: manager.name,
    })
    employees.push(emp)
  }

  return employees
}

export const employees = generateEmployees()

// Helper functions for filtering
export const getEmployeesByDepartment = (department) =>
  employees.filter(e => e.department === department)

export const getEmployeesByLocation = (location) =>
  employees.filter(e => e.location === location)

export const getEmployeesByManager = (managerId) =>
  employees.filter(e => e.managerId === managerId)

export const getEmployeeById = (id) =>
  employees.find(e => e.id === id)

export const getEmployeesByIds = (ids) =>
  employees.filter(e => ids.includes(e.id))

export const getSFEmployees = () =>
  employees.filter(e => e.location === 'San Francisco')

export const getVisaHolders = () =>
  employees.filter(e => e.visaType !== null)

export const getEmployeesOnLeave = () =>
  employees.filter(e => e.onLeave)

export const getHourlyEmployees = () =>
  employees.filter(e => e.isHourly)

export const getEngineeringEmployees = () =>
  employees.filter(e => ['Engineering', 'Platform Engineering', 'AI/ML'].includes(e.department))

// Key people for scenarios
export const KEY_PEOPLE = {
  vpEngineering: employees.find(e => e.title === 'VP Engineering'),
  vpAIML: employees.find(e => e.title === 'VP AI/ML'),
  ceo: employees.find(e => e.title === 'CEO'),
  coo: employees.find(e => e.title === 'COO'),
  cfo: employees.find(e => e.title === 'CFO'),
  vpLegal: employees.find(e => e.title === 'VP Legal'),
  vpHR: employees.find(e => e.title === 'VP HR'),
  facilitiesDirector: employees.find(e => e.title === 'Director of Facilities'),
}

export default employees
