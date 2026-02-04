# Phase 5: Add Action Flow

## 5.1 Build Action Type Selector
- Grid of common action types with icons
- "Custom Attribute Update" option
- Selection advances to employee selection

**Exit Criteria:**
- [ ] All 7 common actions from spec displayed
- [ ] Custom option available
- [ ] Selection stored in state

## 5.2 Build Attribute Browser (for Custom Action)
- Left sidebar with categories
- Checkbox list of attributes per category
- Selected attributes shown as pills

**Exit Criteria:**
- [ ] All categories from taxonomy appear
- [ ] Clicking category shows its attributes
- [ ] Can select multiple attributes across categories

## 5.3 Build Employee Selection - Filters Tab
- Visual filter builder
- Fields: Department, Level, Manager, Location, etc.
- Live count of matching employees
- AND logic between filters

**Exit Criteria:**
- [ ] Can add multiple filter conditions
- [ ] Employee count updates as filters change
- [ ] Resulting employee list shown

## 5.4 Build Employee Selection - Search Tab
- Type-ahead search by name/email
- Multi-select with checkboxes
- Selected employees shown

**Exit Criteria:**
- [ ] Search filters employees in real-time
- [ ] Can select/deselect individuals
- [ ] Selection persists

## 5.5 Build Employee Selection - Paste Tab
- Textarea for pasting IDs/emails
- Parse and resolve to employees
- Show matches and failures

**Exit Criteria:**
- [ ] Pasted list parses correctly
- [ ] Matched employees shown
- [ ] Unmatched entries highlighted as errors

## 5.6 Build Change Specification - Uniform Mode
- Simple form fields for the scoped attributes
- "Apply to all X employees" button

**Exit Criteria:**
- [ ] Shows only attributes for selected action type
- [ ] Values apply to all selected employees

## 5.7 Build Change Specification - Per-Employee Mode
- Scoped spreadsheet: rows = employees, columns = scoped attributes
- Current value | New value columns
- Inline editing

**Exit Criteria:**
- [ ] Only relevant attributes shown as columns
- [ ] Can edit values per employee
- [ ] Changes saved to action state

## 5.8 Wire Up Action Creation Flow
- Complete flow: type → (attributes) → employees → changes → confirm
- "Add to Builder" saves action
- Return to rollup view

**Exit Criteria:**
- [ ] Full flow works end-to-end
- [ ] New action appears in rollup
- [ ] Can add multiple actions
