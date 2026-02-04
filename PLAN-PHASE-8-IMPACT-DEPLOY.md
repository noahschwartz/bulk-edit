# Phase 8: Impact Preview, Monitoring & Polish

## 8.1 Build Per-Action Downstream Impact
- Expand on rollup cards
- Rippling Apps section
- Connected Apps section

**Exit Criteria:**
- [ ] Each action card shows downstream impact
- [ ] Impact descriptions from mock data
- [ ] Scenario 4 shows all 220 employees affecting all systems

## 8.2 Build Overall Downstream Impact Panel
- Aggregate across all actions
- Three-tier view: Employee Graph → Rippling Apps → Connected Apps
- Payroll cutoff warnings

**Exit Criteria:**
- [ ] Totals correct across actions
- [ ] All tiers populated
- [ ] Warnings contextual to effective date

## 8.3 Build Per-Employee Impact View
- Click employee → modal/panel
- Shows all changes for that person across all actions
- Shows downstream impact for that individual

**Exit Criteria:**
- [ ] Accessible from any employee row
- [ ] Aggregates changes from multiple actions
- [ ] Downstream impact scoped to individual

## 8.4 Build Execution Monitor
- Post-commit view
- Three-tier status:
  - Employee Graph: applied
  - Rippling Apps: status per app
  - Connected Apps: status with connection-type language

**Exit Criteria:**
- [ ] Shows committed bulk change
- [ ] All status types from spec (Sent & confirmed, Sent awaiting, Pending sync, Issues)
- [ ] Matches Scenario 1's monitoring example

## 8.5 Final Polish
- Responsive layout for laptop demo
- Loading states
- Empty states
- Transitions between views

**Exit Criteria:**
- [ ] Works on 1280px+ viewport
- [ ] No jarring layout shifts
- [ ] Professional appearance

## 8.6 Deploy to Vercel
- Run production build
- Deploy with `npx vercel`
- Verify all routes work

**Exit Criteria:**
- [ ] `npm run build` succeeds
- [ ] Deployed URL accessible
- [ ] All 4 scenarios navigable on deployed version
