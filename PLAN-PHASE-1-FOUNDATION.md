# Phase 1: Foundation & Infrastructure

## 1.1 Install and Configure Tailwind CSS
- Install tailwindcss, postcss, autoprefixer
- Initialize config, set content paths
- Replace index.css with Tailwind directives, remove App.css

**Exit Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] Test div with `bg-blue-500 text-white p-4` renders correctly

## 1.2 Install React Router
- Install react-router-dom
- Set up BrowserRouter in main.jsx
- Create route structure in App.jsx

**Exit Criteria:**
- [ ] Routes work: `/`, `/create`, `/builder/:id`
- [ ] Browser back/forward works

## 1.3 Create Layout Component
- Header with "Bulk Change Builder" title
- Centered content area with max-width
- Consistent padding

**Exit Criteria:**
- [ ] Header visible on all pages
- [ ] Layout consistent across navigation

## 1.4 Create Progress Stepper Component
- 7 steps: Create → Build Actions → Review & Validate → Set Effective Date → Approve → Submit → Monitor
- Props: currentStep, completedSteps
- States: completed (checkmark), current (highlighted), upcoming (dimmed)

**Exit Criteria:**
- [ ] All 7 steps render horizontally
- [ ] Visual states work correctly for completed/current/upcoming

## 1.5 Create Placeholder Pages
- `BulkChangeList.jsx` - list view
- `CreateBulkChange.jsx` - create form
- `Builder.jsx` - main builder with stepper

**Exit Criteria:**
- [ ] Each route renders correct placeholder
- [ ] All wrapped in Layout

## 1.6 Set Up State Management
- Create BulkChangeContext with provider
- State shape: id, name, description, status, actions[], effectiveDate, approvals[], currentStep, completedSteps[]
- useBulkChange hook

**Exit Criteria:**
- [ ] Context accessible from any component
- [ ] State persists across route navigation
