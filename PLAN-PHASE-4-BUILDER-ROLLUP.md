# Phase 4: Builder Home & Rollup View

## 4.1 Build Builder Shell
- Progress stepper at top
- Bulk change name and status header
- Tab toggle: "Rollup Cards" / "Combined Spreadsheet"
- "Add Action" button
- Validation warning summary

**Exit Criteria:**
- [ ] Stepper shows correct step based on bulk change state
- [ ] Tabs toggle between views
- [ ] Warning count badge visible

## 4.2 Build Rollup Cards View
- Summary card per action showing:
  - Action type icon and name
  - Employee count
  - Value distribution/range (for comp: min/max/median)
  - Downstream impact preview
- Cards are clickable

**Exit Criteria:**
- [ ] Each action renders as a card
- [ ] Stats calculated correctly from action data
- [ ] Clicking card drills into detail view

## 4.3 Build Overall Summary Stats
- Total employees affected (deduplicated across actions)
- Total actions count
- Validation warnings/errors count

**Exit Criteria:**
- [ ] Employee count is unique (no double-counting)
- [ ] Warning/error counts match actual validation issues

## 4.4 Build Combined Spreadsheet View (stub)
- Table showing all employees across all actions
- Columns: Employee name + all changing attributes
- Mark which action each change comes from

**Exit Criteria:**
- [ ] All affected employees appear once
- [ ] All changing attributes as columns
- [ ] Data populates from actions
