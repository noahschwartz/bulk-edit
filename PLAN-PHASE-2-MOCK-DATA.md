# Phase 2: Mock Data & Core Data Layer

## 2.1 Create Employee Mock Data
- ~220 employees (to support Scenario 4's 220 relocations)
- Realistic names, departments, titles, levels, comp, locations
- Include SF and Austin office employees
- Mix of: Engineering, AI/ML, Platform Engineering, other depts
- Include visa holders, employees on leave, hourly workers

**Exit Criteria:**
- [ ] 220+ employees in mock data
- [ ] Employees have all attributes needed for 4 scenarios
- [ ] Data includes edge cases (visa, leave, hourly)

## 2.2 Create Bulk Change Mock Data
- Pre-populate all 4 scenarios as draft bulk changes:
  1. Q1 2026 Performance Cycle (85 comp, 12 promotions, 8 transfers)
  2. Engineering Reorg Feb 2026 (40 dept transfers, 15 manager changes)
  3. Manager Updates 6 Reports (6 comp, 2 titles)
  4. SF Office Consolidation (220 location changes, 220 tax updates)

**Exit Criteria:**
- [ ] 4 bulk changes exist in mock data
- [ ] Each has correct actions with employee assignments
- [ ] Validation warnings pre-populated

## 2.3 Create Attribute Definitions
- Define all ~100 attributes from spec taxonomy
- Group by category (Employment & Role, Compensation, Location, etc.)
- Include which common actions use which attributes

**Exit Criteria:**
- [ ] All attribute categories defined
- [ ] Attributes mapped to common action types
- [ ] Category navigation data structure ready

## 2.4 Create Downstream Impact Definitions
- Define Rippling Apps (Payroll, Benefits, Device Mgmt, Time & Attendance)
- Define Connected Apps (Slack, Google Workspace, GitHub)
- Map which attribute changes trigger which downstream updates

**Exit Criteria:**
- [ ] All apps defined with impact descriptions
- [ ] Attribute → downstream mapping complete
