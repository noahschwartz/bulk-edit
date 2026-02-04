# Phase 7: Validation, Dates & Approval Flow

## 7.1 Build Validation Summary Panel
- Errors (blocking) with count
- Warnings (non-blocking) with count
- Info items
- Click to jump to relevant row/action

**Exit Criteria:**
- [ ] All validation categories shown
- [ ] Counts accurate
- [ ] Links navigate to source

## 7.2 Implement Validation Rules
- Minimum wage check (CA employees)
- Large change detection (>20%)
- Circular manager chain detection
- Scheduled job conflict detection
- Visa hold detection (Scenario 4)
- Active leave detection (Scenario 4)

**Exit Criteria:**
- [ ] All scenarios show expected validation issues
- [ ] Blocking errors prevent progression
- [ ] Warnings allow continuation

## 7.3 Build Set Effective Date Screen
- Date picker
- Reason/comment textarea
- Payroll cutoff warning if applicable

**Exit Criteria:**
- [ ] Can select future date
- [ ] Comment saved to bulk change
- [ ] Stepper advances to step 4

## 7.4 Build Self-Approval Gate
- Checklist of confirmations
- "I have reviewed..." checkboxes
- Submit button enabled when all checked

**Exit Criteria:**
- [ ] All 4 confirmation items from spec
- [ ] Can't proceed until all checked
- [ ] Advances to approval routing

## 7.5 Build Approval Tracker
- Group approvals by scope (employee type + field)
- Show: approver name, role, contact, backup, status, due date
- Status: pending, approved, rejected, overdue

**Exit Criteria:**
- [ ] All 4 scenarios show correct approvers
- [ ] Scenario 4 shows 3 separate approvers (Finance, Legal, Facilities)
- [ ] Contact info and backups displayed

## 7.6 Build Submit & Commit Confirmation
- Final confirmation modal
- Transaction semantics warning
- Commit button

**Exit Criteria:**
- [ ] Shows employee count and effective date
- [ ] "All or nothing" language present
- [ ] Commit transitions to monitoring
