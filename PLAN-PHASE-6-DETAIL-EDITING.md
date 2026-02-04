# Phase 6: Detail Views & Editing

## 6.1 Build Scoped Detail View
- Drill-in from rollup card
- Per-employee table with current/new/delta columns
- Action-level rollup stats at top

**Exit Criteria:**
- [ ] Shows only employees in that action
- [ ] Shows only attributes for that action type
- [ ] Delta calculated correctly

## 6.2 Add Inline Editing
- Click cell to edit
- Validation on blur
- Visual feedback for changes

**Exit Criteria:**
- [ ] Can click and edit any "new value" cell
- [ ] Invalid values show error state
- [ ] Changes persist

## 6.3 Add Sort and Filter
- Column header click to sort
- Filter bar for employee name/department

**Exit Criteria:**
- [ ] Sorting works on all columns
- [ ] Filter reduces visible rows
- [ ] Sort/filter state persists

## 6.4 Add Validation Display
- Inline validation errors per row
- Outlier highlighting (>20% change)
- Error/warning icons with tooltips

**Exit Criteria:**
- [ ] Minimum wage violations shown inline
- [ ] Large changes highlighted
- [ ] Circular manager chain flagged in Scenario 2

## 6.5 Build Combined Spreadsheet (full)
- Extend stub from 4.4
- Sortable, filterable
- Shows which action each change comes from

**Exit Criteria:**
- [ ] Full functionality matching scoped view
- [ ] Action source column populated
- [ ] All affected employees visible
