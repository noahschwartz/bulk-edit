# Phase 3: List & Create Screens

## 3.1 Build Bulk Change List Screen
- Show all bulk changes (drafts and committed)
- Display: name, status, employee count, action count, date
- Click navigates to builder

**Exit Criteria:**
- [ ] All 4 mock scenarios appear in list
- [ ] Status badges show correctly (Draft, Committed)
- [ ] Clicking a row navigates to `/builder/:id`

## 3.2 Build Create Bulk Change Screen
- Name input (required)
- Description textarea (optional)
- Create button → creates draft, navigates to builder

**Exit Criteria:**
- [ ] Form validates name is required
- [ ] Submit creates new bulk change in state
- [ ] Redirects to `/builder/:newId`
