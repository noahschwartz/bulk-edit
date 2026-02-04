# Rippling Bulk Change Builder — Product Spec & Prototype Brief

## Context

Rippling administrators currently change employee attributes one at a time. Customers want to make changes affecting many employees at once — reorgs, comp cycles, office moves. This prototype demonstrates a "Bulk Change Builder" for a VP Product case study interview.

### Design Constraints (from prompt)
- Must handle hundreds of employees. Must also gracefully handle a dozen.
- Only attribute updates to existing employees. No onboarding, no terminations.
- Must support multiple attributes changed simultaneously, with different values per employee (e.g., post-performance-review: different comp, title, and level per person).
- Rippling is an interconnected system: single system of record (the Employee Graph) → first-party Rippling products (Payroll, Benefits, Device Management) → third-party integrations (Slack, Google Workspace, GitHub).

### Key Design Insight

A spreadsheet-first approach fails because:
- **Rows (employees)**: Hundreds — manageable.
- **Columns (attributes)**: Thousands — unmanageable. Employment info, personal info, comp (base/bonus/equity/frequency/currency), benefits, devices, apps, manager chain, cost center, legal entity, work authorization, custom fields...
- No one opens a 200 × 1,000 spreadsheet. Even filtered, it assumes the admin knows which columns matter before they start.

The builder pattern sidesteps this by exposing **actions** (common operations like "update comp" or "reassign office"), not the raw attribute space. Each action knows which attributes it touches and which validations apply. For anything not covered by a common action, a custom attribute update provides a navigable browser of all employee attributes organized by category.

---

## Core Concept: The Builder Pattern

Think shopping cart, not spreadsheet.

A Bulk Change is a **named, saveable draft object** (e.g., "Q1 2026 Comp Cycle," "NYC Office Move - March"). Admins accumulate changes through discrete actions, see rollups, drill in to adjust, preview downstream impact, and confirm once at the end.

Real reorgs take days to assemble. The builder supports this — it's not a one-session wizard.

### Transaction Semantics

**A bulk change is all-or-nothing.** When committed, every action in the bulk change is written to the Employee Graph as a single transaction. If any part fails, nothing is committed. This is critical because actions within a bulk change may depend on each other — a reorg might include department moves, manager changes, and title updates that only make sense together.

This must be clear in the UI. The builder should communicate: "All changes in this bulk change will be applied together. If any change cannot be applied, none will be applied." If the user has truly independent changes (comp cycle + unrelated office move), they should create separate bulk changes.

### Progress Stepper

Throughout the entire process, the user sees a persistent stepper showing where they are, how deep they're in, and what's left:

```
① Create  →  ② Build Actions  →  ③ Review & Validate  →  ④ Set Effective Date  →  ⑤ Approve  →  ⑥ Submit  →  ⑦ Monitor
    ✓              ✓                   (current)
```

Each step shows completion state. The user always knows what's next.

---

## User Flow

### Step 1: Create a Bulk Change

- Name it (free text, e.g., "Q1 2026 Comp Cycle")
- Optional: description, category/type tag
- Status: Draft
- This becomes a persistent object the admin returns to over hours/days

### Step 2: Add Actions

Each action is a discrete, legible unit of change. The admin adds actions one at a time.

#### Common Actions

These are pre-built action types that map to frequent HR operations. Each one pre-scopes the attributes shown to the user — no browsing the full attribute space. More common actions can be added over time, and customers could eventually configure their own.

| Common Action | Attributes Scoped | Example Use Case |
|--------------|-------------------|-----------------|
| Update Compensation | Base salary, bonus target, equity grants, pay frequency, currency | Annual review raises |
| Change Department | Department, cost center | Reorg |
| Change Manager | Reports-to, dotted-line manager | Reorg |
| Reassign Office / Location | Work location, work address, tax jurisdiction (auto-derived) | Office move/consolidation |
| Update Title & Level | Job title, level/band, job family | Promotions |
| Change Team | Team assignment | Team restructure |
| Update Work Schedule | Employment type (FT/PT), hours per week, shift, work arrangement (remote/hybrid/onsite) | Policy changes |

#### Custom Attribute Update

For anything not covered by a common action. Instead of exposing a flat list of thousands of attributes, the custom action provides a **navigable attribute browser** organized by category. The user picks the attributes they want to change, and only those appear in the editing spreadsheet.

**Employee Attribute Taxonomy (~100 attributes organized by category):**

**Employment & Role**
- Job title
- Level / band
- Job family / function
- Department
- Division
- Business unit
- Team
- Cost center
- Employee ID / badge number
- Employment type (full-time, part-time, contractor, intern, temp)
- Employment status (active, leave, suspended)
- Worker type (W-2, 1099)
- Start date
- Original hire date (for rehires)
- Probation end date
- Expected end date (contractors/temps)
- Job description
- FLSA status (exempt / non-exempt)
- Union membership
- Bargaining unit
- Position code
- Requisition ID

**Reporting & Organization**
- Direct manager
- Dotted-line manager
- Skip-level manager (read-only / derived)
- HR business partner
- Executive sponsor
- Direct reports (read-only / derived)

**Compensation**
- Base salary
- Pay rate (hourly)
- Pay frequency (weekly, biweekly, semi-monthly, monthly)
- Pay currency
- Target annual bonus (amount or %)
- Bonus structure / plan
- Commission plan
- Commission rate
- Equity — stock options (grant count)
- Equity — RSU grants
- Equity — vesting schedule
- Sign-on bonus
- Retention bonus
- Relocation allowance
- Stipend (home office, wellness, education)
- Total target compensation (derived)
- Comp band minimum
- Comp band maximum
- Comp band midpoint
- Compa-ratio (derived)

**Location & Workplace**
- Work location (office name)
- Work address (street, city, state/province, postal code, country)
- Tax jurisdiction — state (auto-derived from work address)
- Tax jurisdiction — local (auto-derived from work address)
- Tax jurisdiction — country (auto-derived from work address)
- Home address (street, city, state/province, postal code, country)
- Work arrangement (onsite, hybrid, remote)
- Time zone
- Default office floor / desk / zone

**Time & Schedule**
- Work schedule (e.g., Mon-Fri 9-5)
- Hours per week
- Shift assignment
- Overtime eligibility
- PTO policy
- Sick leave policy
- Holiday calendar
- Time-off accrual rate

**Personal & Identity**
- Legal first name
- Legal last name
- Preferred first name (display name)
- Preferred pronouns
- Date of birth
- Gender
- Ethnicity (voluntary self-ID, EEO)
- Veteran status (voluntary self-ID)
- Disability status (voluntary self-ID)
- Marital status
- SSN / national ID (masked, restricted access)
- Citizenship
- Work authorization type (visa type)
- Work authorization expiry date
- Emergency contact — name
- Emergency contact — phone
- Emergency contact — relationship
- Personal email
- Personal phone

**Work Contact & Access**
- Work email
- Work phone
- Work mobile
- Slack handle / ID
- GitHub username
- Google Workspace account
- Microsoft 365 account
- Badge / keycard ID
- VPN access group
- Building access group

**IT & Devices**
- Assigned laptop (asset tag)
- Assigned mobile device (asset tag)
- Assigned monitor(s)
- Software license group
- Security clearance level
- MFA enrollment status
- Device management policy group

**Benefits & Payroll**
- Benefits eligibility group
- Medical plan
- Dental plan
- Vision plan
- Life insurance plan
- 401(k) / retirement plan
- 401(k) contribution % (employee)
- FSA / HSA enrollment
- Commuter benefits
- Bank account (direct deposit — masked)
- Tax filing status (federal)
- Tax filing status (state)
- W-4 allowances / withholding
- State tax withholding
- Garnishment / deduction orders

**Custom & Company-Specific**
- Custom field 1–N (configurable per customer)
- Tags / labels
- Notes (free text)
- Employee group memberships

In the UI, the attribute browser shows these categories as a left-nav sidebar. Click "Compensation" → see the ~20 comp attributes. Check the ones you want to change. Only those checked attributes appear as columns in the editing spreadsheet.

#### Selecting Employees

Five distinct methods, clearly presented as tabs or toggle options:

1. **Filters**: Visual filter builder. "Department is Engineering AND Level is L4 AND Manager is Matt Chen." Dropdowns and auto-complete for values. Shows a live count of matching employees as filters are applied.

2. **RQL (Advanced)**: For power users who know Rippling Query Language. Free-text query input with syntax highlighting and auto-complete. "SELECT employees WHERE department = 'Engineering' AND level >= 4." Shows the resulting employee list.

3. **Search & Select**: Type-ahead search by name, email, or ID. Multi-select with checkboxes. Best for small sets or hand-picking specific people.

4. **Paste IDs / Emails**: Paste a list of employee IDs or emails (one per line or comma-separated). System resolves them and shows matches/failures. Good for importing from an external list.

5. **Reuse from Previous Bulk Change**: Select employees from a prior bulk change. "Use the same 85 people from Q4 2025 Comp Cycle." Useful for recurring operations (quarterly reviews, annual updates).

After selection by any method, the user sees the resolved employee list with key details (name, department, title, current values for relevant attributes) and can add/remove individuals before confirming.

#### Specifying Changes

Two modes per action:

- **Uniform**: Set the same value for everyone (e.g., department → "Platform Engineering"). Simple form fields.
- **Per-employee**: Different values per person (e.g., each person gets a different salary). Opens a **scoped spreadsheet** — rows are the selected employees, columns are ONLY the attributes relevant to this action type. For a comp common action: base, bonus, equity. Not 1,000 columns. 5 columns.

**Intra-action attribute dependencies**: Some attributes auto-cascade within an action. Changing work location auto-derives tax jurisdiction. Switching from hourly to salaried auto-updates pay frequency options. Changing department may auto-suggest a new cost center. These cascades happen in real-time as the user edits, with visual indication ("Tax jurisdiction updated to TX based on Austin office location").

**CSV Import**: Available as an ingestion method into any action. "Add action → Import from CSV." The CSV is parsed into an action with per-employee values. The builder then validates and displays it like any other action. This means people with an existing spreadsheet from their HRBP can use it, but they get the same validation and preview. The in-app experience should be good enough that next time they skip the CSV.

**Action is added to the builder** as a reviewable line item.

### Step 3: Rollup View (Default Home of the Bulk Change)

This is the most important screen. It optimizes for **comprehension and confident confirmation**.

#### Overall Rollup

**Summary cards showing aggregate stats:**
```
Q1 2026 Comp Cycle                          Draft | 3 actions
─────────────────────────────────────────────────────────────────────────
📊 142 employees affected across 3 actions

💰 Compensation Updates          85 employees
   Range: +$5,000 to +$25,000 | Median: +$12,000
   Total annual impact: +$1.2M/year

🏢 Department Transfers          40 employees
   Engineering → Platform Engineering (32)
   Engineering → AI/ML (8)

📋 Title & Level Updates         17 employees
   Senior → Staff (12) | Staff → Principal (5)

⚠️  3 validation warnings — Review
```

Each summary card is clickable → drills into the scoped detail view for that action.

#### Per-Action Rollup

Clicking into an action card shows the rollup for just that action: employee count, value distribution, validation status, and downstream impact scoped to that action's changes.

#### Combined Spreadsheet View

A tab/toggle that shows **all employees across all actions** in a single spreadsheet. Rows are employees, columns are every attribute being changed across all actions. If an employee appears in multiple actions (comp + title), their row shows all changing attributes. This gives the "full picture" view for admins who want to see everything at once, while the default rollup cards provide the comprehension-first experience.

### Step 4: Drill-In Detail View

Clicking an action card opens the scoped spreadsheet for that action. For "Compensation Updates":

| Employee | Dept | Current Base | New Base | Δ | Current Bonus | New Bonus | Δ |
|----------|------|-------------|----------|---|---------------|-----------|---|
| Jane Doe | Eng | $140,000 | $155,000 | +$15,000 | $14,000 | $20,000 | +$6,000 |
| John Smith | Eng | $125,000 | $130,000 | +$5,000 | $12,500 | $13,000 | +$500 |

- Sortable, filterable
- Inline editable — click a cell to adjust
- Outlier highlighting (e.g., change > 20% gets a visual flag)
- Validation errors shown inline with the row (e.g., "New base below minimum wage for CA")
- "Set all" option in column header for uniform changes

### Step 5: Validation

Validation happens continuously as actions are added, with a summary on the rollup view. The user resolves all blocking errors before proceeding.

**Validation categories:**

- **Errors (blocking):** Minimum wage violations, missing required fields, invalid values, circular manager chains (A reports to B reports to A), employee not found
- **Warnings (non-blocking):** Large comp changes (>20%), benefits eligibility changes, tax jurisdiction changes, pending payroll run conflicts
- **Info:** Downstream system updates that will be triggered, notification requirements (WARN Act, pay transparency laws)

**Scheduled job conflict detection:** Before proceeding, the system checks for any already-scheduled bulk changes that affect the same employees and attributes. If another bulk change is scheduled to modify Jane Doe's salary on Feb 1, and this bulk change also modifies her salary, that's a conflict. The user must resolve it — either adjust the effective date, remove the conflicting employee, or cancel the other job. This prevents two concurrent changes to the same field from producing unpredictable results.

### Step 6: Set Effective Date

**Before approval routing**, the user sets:

- **Effective date**: When changes take effect in the Employee Graph. Can be immediate or future-dated.
- **Reason/comment**: Free text for audit trail ("Per Q1 performance review decisions approved by CFO on 1/28")

This is set before approvals so that approvers know exactly when these changes will land and how much time they have to review and approve.

### Step 7: Self-Approval

The submitter must explicitly review and approve the bulk change themselves before routing to others. This is a gate, not a rubber stamp. The submitter confirms:

- They've reviewed the rollup and detail views
- They've resolved all validation errors
- They've reviewed the downstream impact preview
- They understand the effective date and transaction semantics ("all or nothing")

Without this, routing to approvers would be noise — sending half-baked changes to a CFO wastes everyone's time.

### Step 8: Approval Routing

Approval chains are **determined by the employee and the field being changed**, not by the action type or bulk change as a whole. Different employees may have different approval chains for the same field. For example:
- Comp changes for IC engineers might require VP Engineering approval
- Comp changes for directors might require CEO approval
- Department changes might require both the losing and gaining department heads

After the submitter self-approves, the system resolves all required approvals and presents an **approval tracker**:

```
Approval Status                                    Effective: Feb 1, 2026
─────────────────────────────────────────────────────────────────────────
Comp Changes — Engineering ICs (72 employees)
  Approver: Sarah Kim, VP Engineering
  Contact: skim@company.com | Slack: @skim
  Backup: James Wu, Sr. Dir Engineering (jwu@company.com)
  Status: ⏳ Pending (sent Jan 28, due Jan 31)

Comp Changes — Directors (13 employees)
  Approver: David Park, CEO
  Contact: dpark@company.com | Slack: @dpark
  Backup: Lisa Chen, COO (lchen@company.com)
  Status: ✅ Approved (Jan 29)

Department Transfers (40 employees)
  Approver: Sarah Kim, VP Engineering
  Status: ⏳ Pending
  
  Approver: Raj Patel, VP AI/ML (gaining dept)
  Status: ⏳ Pending

Title & Level Updates (17 employees)
  Approver: Sarah Kim, VP Engineering
  Status: ⏳ Pending
```

Key elements:
- **Approver name and role** for each approval needed
- **Contact information** (email, Slack) so the submitter can follow up
- **Backup contact** in case the primary approver is unavailable
- **Status** with timestamps (pending, approved, rejected, overdue)
- **Due date** derived from the effective date

#### Approver Experience

The approver sees the **exact same builder interface** — rollup view, drill-in detail, downstream impact — but **scoped to only the employees and fields they're approving.** Sarah Kim sees the 72 IC comp changes and 40 department transfers she needs to approve. She doesn't see David Park's 13 director comp approvals.

The approver can:
- Review the rollup (total budget impact of just their scope)
- Drill into individual employee changes
- See downstream impact for their scope
- Approve, reject, or request changes with comments
- See the effective date and understand urgency

### Step 9: Submit & Commit

Once all approvals are received:

- **Final confirmation**: "All approvals received. You are about to commit 142 employee changes as a single transaction with effective date Feb 1, 2026. All changes will be applied together — if any change cannot be applied, none will be applied. Proceed?"
- Commit writes to the Employee Graph as a single atomic transaction.
- If anything fails at write time, the entire bulk change is rolled back and the user is told what failed.

### Step 10: Monitoring

After successful commit, changes propagate from the Employee Graph outward. The monitoring dashboard is split into three tiers reflecting how Rippling's architecture works:

```
Q1 2026 Comp Cycle                    Committed | Effective: Feb 1, 2026
═══════════════════════════════════════════════════════════════════════════

EMPLOYEE GRAPH
  ✅ All changes applied              142 employees updated

RIPPLING APPS
  These are Rippling's own products. We know exactly when they've
  processed the changes.

  Payroll            🔄 Scheduled       Will process in Feb 15 payroll run
  Benefits           ✅ Updated          4 re-enrollments triggered
  Device Management  ✅ Updated          40 permission sets refreshed
  Time & Attendance  ✅ Updated          PTO policies reassigned

CONNECTED APPS
  These are third-party apps connected to Rippling. We send the
  updates — the status below shows whether the app received them.

  Slack              ✅ Sent & confirmed     40 channel updates
  Google Workspace   ⚠️ Sent, 1 issue        39/40 confirmed, 1 retry pending
  GitHub             ✅ Sent & confirmed     8 team updates
```

**Connection type transparency (non-technical language):**

- **"Sent & confirmed"**: Rippling pushed the update and the app confirmed it received it. (API push integrations — Rippling calls the third-party API and gets a success response.)
- **"Sent, awaiting confirmation"**: Rippling sent the update but hasn't heard back yet. (Webhook-based — Rippling fires the webhook, delivery confirmed, but processing status unknown.)
- **"Pending sync"**: This app pulls updates from Rippling on its own schedule. The changes are ready, and the app will pick them up on its next sync. (Polling-based integrations.)
- **"Sent, X issue(s)"**: Rippling tried to send the update but something went wrong. Retrying automatically. (API returned an error, webhook delivery failed, etc.)

This avoids saying "complete" for third-party apps where Rippling can't verify the app actually processed the change. It's honest without being overly technical.

---

## Downstream Impact Preview (shown before commit)

### Per-Action Impact

Each action card in the rollup view includes a downstream impact section showing what that specific action will trigger:

**Compensation Updates (85 employees):**
```
Rippling Apps:
  Payroll — Recalculation for next pay cycle (Feb 15)
            12 employees cross tax bracket thresholds
  Benefits — 4 employees become eligible for new benefit tier

Connected Apps:
  No direct impact from comp changes
```

**Department Transfers (40 employees):**
```
Rippling Apps:
  Device Management — App permission review triggered
                      8 employees gain ML platform tool access
  Time & Attendance — PTO policy reassignment for 40 employees

Connected Apps:
  Slack — 40 channel membership updates
  Google Workspace — 40 group membership updates
  GitHub — 8 team membership updates
```

### Overall Impact

Rolled up across all actions:

```
Employee Graph     142 employees modified as single transaction
Rippling Apps      4 apps affected (Payroll, Benefits, Device Mgmt, Time & Attendance)
Connected Apps     3 apps will receive updates (Slack, Google Workspace, GitHub)

⚠️ Payroll run scheduled for Feb 15 — changes will be included if committed before Feb 13 cutoff
⚠️ 4 employees will be prompted to re-enroll in benefits within 30 days
```

### Per-Employee Impact

Clicking an employee row anywhere in the builder shows everything that will change for that individual across all actions and all systems. This is the "what happens to Jane Doe?" view.

---

## Demo Scenarios to explicitly support

### Scenario 1: "Q1 2026 Performance Cycle" (large, complex)

What makes it hard: Every employee gets a different raise, different bonus target, some get equity grants, some get promoted (title + level change) alongside the comp bump, and a few get nothing. Finance needs to approve the total budget impact before anything commits. Some employees are in California where new comp might cross pay transparency thresholds requiring updated job postings. A few are hourly workers where the raise needs to translate to a new hourly rate, not salary. Payroll runs in 6 days so if this doesn't land before the cutoff they wait another month.

Contents:
- 85 comp changes (varied: $5K-$25K raises, a few equity grants)
- 12 promotions (title + level changes)
- 8 department transfers (Engineering → AI/ML)
- 3 validation warnings (1 below minimum wage, 1 >25% raise flagged, 1 scheduled job conflict)
- Multiple approvers required (VP Eng for ICs, CEO for directors)

### Scenario 2: "Engineering Reorg — Feb 2026" (medium, multi-action)

What makes it hard: 40 engineers move from "Engineering" to either "Platform Engineering" or "AI/ML" — but it's not uniform, it's a judgment call per person. Some get new managers. The department change cascades to cost centers which affects budget allocation. Slack channels, GitHub teams, Google groups, and device access policies all need to update. An intern reports to someone moving to AI/ML but should stay on Platform — needs a new manager too. Takes a week to assemble with input from three VPs.

Contents:
- 32 department transfers to Platform Engineering
- 8 department transfers to AI/ML
- 15 manager changes
- 1 circular manager chain flagged
- Downstream: Slack, GitHub, Google Workspace updates

### Scenario 3: "Manager Updates 6 Direct Reports Post-Review" (small, simple)

What makes it hard: It doesn't — that's the point. Shows the builder works just as well for a quick task.

Contents:
- 6 comp changes (per-employee values)
- 2 title updates
- No approval routing needed (within manager's authority)
- Done in under 2 minutes

### Scenario 4: "SF Office Consolidation to Austin — March 2026" (large, wide downstream blast radius)

What makes it hard: 220 employees across every department are relocating. This is the widest downstream fan-out possible — every system gets hit. Location changes cascade to tax jurisdiction (CA → TX eliminates state income tax for all 220), which triggers payroll recalculation for everyone. 34 employees lose California-mandated benefits coverage and need re-enrollment within 30 days. 11 employees are on work visas where the state change requires immigration counsel review — they can't be moved without legal sign-off, so they're flagged as blocking. 3 employees are on active FMLA/disability leave and legally can't have employment terms changed mid-leave. Device Management needs to reprovision VPN configs, revoke SF badge access, and grant Austin badge access for all 220. Every connected app with location-scoped groups needs updating — Slack (office channels), Google Workspace (office distribution lists), GitHub (nothing, but the system should confirm that). Comp isn't changing, but 18 hourly employees need their overtime eligibility re-evaluated under Texas law, which is different from California. The effective date is March 1, but the Austin lease starts Feb 15, so HR wants to allow early movers to update before the bulk date — requiring a conversation about whether to split into two bulk changes or handle the 12 early movers separately. Finance needs to approve because the tax jurisdiction change affects budget forecasting. Facilities needs to coordinate badge access. Legal needs to sign off on the visa employees. Three different approvers, none of whom care about each other's scope.

Contents:
- 220 location changes (SF → Austin, uniform value but massive downstream)
- 220 work address updates
- 220 tax jurisdiction changes (auto-derived from location)
- 18 overtime eligibility re-evaluations (CA exempt rules ≠ TX exempt rules)
- 14 blocking validation errors (11 visa holds, 3 active leave)
- 34 benefits re-enrollment warnings
- Approvers: Finance (budget impact of tax change), Legal (visa employees), Facilities (badge access)
- Downstream: Payroll (all 220), Benefits (34), Device Management (all 220), Slack (220 channel swaps), Google Workspace (220 group updates)

Why this scenario matters for the demo: It stress-tests the rollup view — can you comprehend 220 people moving at once? The answer is yes, because the rollup shows "220 location changes, SF → Austin" as one card with the downstream preview broken out by tier. It also shows the validation system catching the 14 people who *can't* move yet, which is exactly the kind of mistake that would be invisible in a CSV. And the three-approver structure with completely different scopes (Finance sees budget, Legal sees visa employees, Facilities sees badge access) demonstrates why the approval system must be field-and-employee scoped, not bulk-change scoped.

---

## Tech Stack
- React + Vite + Tailwind CSS
- Single-page app, no backend, all mock data
- Deploy to Vercel (`npx vercel`)

### Screens to Build

1. **Bulk Change List** — shows saved drafts and committed changes. Entry point.

2. **Create Bulk Change** — name, description. Creates draft.

3. **Builder Home / Rollup View** — progress stepper visible. List of actions with rollup stats. Tabs for "Rollup Cards" vs "Combined Spreadsheet." Per-action rollup on drill-in. "Add Action" button. Validation warning count.

4. **Add Action Flow** — select common action or custom attribute update → for custom, show category-based attribute browser → select employees (tabs for Filters / RQL / Search / Paste / Reuse) → specify changes (uniform or per-employee scoped spreadsheet). Confirm adds to builder.

5. **Scoped Detail View** — drill-in from a rollup card. Per-employee editable table scoped to the relevant attributes. Inline validation. Sort/filter. Per-action rollup stats at top.

6. **Combined Spreadsheet View** — all employees, all changing attributes, across all actions.

7. **Downstream Impact Preview** — per-action and overall. Employee Graph / Rippling Apps / Connected Apps split.

8. **Set Effective Date** — date picker, reason/comment field. Shown before approval step.

9. **Self-Approval Gate** — review confirmation checklist before routing.

10. **Approval Tracker** — shows all required approvers grouped by employee/field scope, status, contact info, backup contacts, due dates.

11. **Execution Monitor** — post-commit view. Three-tier split: Employee Graph / Rippling Apps / Connected Apps with connection-type-appropriate status language.

### Mock Data

Include ~200 mock employees with realistic names, departments, titles, comp levels, locations. Pre-populate all three scenarios.

### Interaction Requirements

- Progress stepper visible and accurate throughout
- Clicking rollup cards drills into per-action detail and rollup
- Combined spreadsheet view toggleable from rollup view
- Cells in detail view are editable (at least visually)
- Employee selection works via at least Filters and Search methods
- Attribute browser for custom actions shows category navigation
- Validation warnings appear inline with scheduled job conflict example
- Downstream preview populated with realistic impact descriptions by tier
- Approval tracker shows mock approver data with contacts and backups
- Monitoring dashboard shows three-tier propagation with appropriate language
- Responsive enough to demo on a laptop in a conference room

### What to Skip

- Authentication/authorization
- Actual data persistence (in-memory state only)
- Real API calls
- Full RQL parser (show the input, mock the results)
- Full approval routing logic (show the tracker UI, mock the states)
- Undo/rollback (describe verbally)
- Mobile optimization

---
