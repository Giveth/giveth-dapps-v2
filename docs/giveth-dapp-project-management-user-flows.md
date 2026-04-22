# Giveth Dapp — Project Management User Flows

This document translates the current Giveth Dapp UI behavior into a cleaner, product-style user flow reference for the following project-management experiences:

1. Create project
2. Open My Projects dashboard
3. Edit project
4. Manage recipient addresses (add a chain address)
5. Activate project
6. Deactivate project
7. Apply for project verification / resume verification
8. Post project update
9. Edit project update

> Scope note: this is a frontend UX flow document based on the current source code behavior. It reflects what the UI currently does, including route guards, modal transitions, validation states, and edge-case handling.

---

## 1) Create Project

### Primary page / entry point
- **Route:** `/create`
- **Goal:** Let a signed-in, registered user create a new project, add recipient addresses, and either save a draft preview or publish.

### Happy path
1. The user opens `/create`.
2. The app checks access prerequisites before showing the full form:
   - wallet is connected,
   - user is signed in,
   - user profile is registered / complete enough to proceed.
3. If all prerequisites pass, the create-project experience opens as a focused full-page form.
4. The user fills in the project information step by step:
   - project name,
   - description,
   - social links,
   - categories,
   - impact location,
   - image,
   - recipient addresses by chain.
5. While the user types, the form autosaves draft-like data in local storage so progress is preserved.
6. The user adds at least one recipient address by selecting a chain and entering a valid receiving address.
7. The user optionally reviews the project using **Preview**.
8. The user clicks **Publish**.
9. The app validates the data, transforms the form payload, and submits the create-project mutation.
10. On success:
    - a preview/draft flow routes to the project page,
    - a publish flow routes to the success page,
    - local storage is cleared for a successful new-project completion.

### Edge cases and alternate states
- **Wallet disconnected:** the user is blocked from the main form and is prompted to connect a wallet.
- **Not signed in:** the user is prompted to sign in before proceeding.
- **Profile incomplete / registration missing:** the user is blocked until account/profile setup is completed.
- **Page refresh or accidental navigation during creation:** entered values are restored from local storage when returning to create mode.
- **No recipient address added:** submission is blocked; the project cannot be created without at least one recipient address.
- **Address validation issues:** invalid, duplicate, unsupported, or chain-mismatched addresses are rejected inline.
- **Stellar-specific flow:** the user may also need to provide a memo, and Stellar-specific messaging appears.
- **Exchange/deposit-address warning:** for non-Stellar chains, the UI warns against using exchange deposit addresses where applicable.
- **Low or medium project-quality signals:** publish may be disabled or may require extra confirmation before continuing.
- **Cancel action:** cancel exits the flow and clears local create-mode local storage.
- **Recurring donations setup:** on supported chains, the user may be offered an optional recurring-donations setup tied to the chain address.

---

## 2) Open My Projects Dashboard

### Primary page / entry point
- **Route:** `/account?tab=projects`
- **Goal:** Let the current user view and manage the projects they own.

### Happy path
1. The user opens the account area and lands on the **Projects** tab.
2. The app resolves the `tab=projects` query parameter and renders the My Projects dashboard.
3. The dashboard fetches the current user’s projects with pagination and ordering.
4. The user sees a list of their projects as project cards.
5. Each project card summarizes project information such as title, creation date, status, listing/verification indicators, and project metrics.
6. The user opens a project card’s **Actions** menu to access project-management tasks like:
   - view project,
   - edit project,
   - manage addresses,
   - add update,
   - activate or deactivate,
   - verify or resume verification when applicable.

### Edge cases and alternate states
- **Wallet disconnected or not signed in:** the account page does not fully render the authenticated dashboard experience until access requirements are met.
- **No created projects:** the user sees an empty state indicating that no projects exist yet.
- **Email not verified:** the project list may still appear, but the dashboard is visually dimmed and interaction is disabled, creating an effectively read-only state.
- **Cause vs project differences:** some actions, such as address management, are only available for standard projects and not for causes.
- **Project-specific action availability:** the dropdown contents change depending on project status, verification state, and ownership context.

---

## 3) Edit Project

### Primary page / entry point
- **Route:** `/project/[id]/edit`
- **Typical entry points:**
  - My Projects dashboard → **Actions** → **Edit Project**
  - Project page admin actions → **Edit Project**
- **Goal:** Let the project owner update an existing project using the same core form as project creation.

### Happy path
1. The user opens edit mode from the dashboard or project page.
2. The app validates that the user can edit the project:
   - wallet connected,
   - signed in,
   - registered,
   - project exists,
   - project is not cancelled,
   - current user is the admin/owner.
3. The edit page loads the existing project data into the shared project form.
4. The user updates any editable fields, such as:
   - title,
   - description,
   - social links,
   - categories,
   - impact location,
   - image,
   - recipient addresses.
5. The user clicks the relevant submit action:
   - save/preview as draft, or
   - publish changes.
6. The app transforms the form data and submits the update-project mutation.
7. On success, the user is routed back to the project page or, in draft-to-publish cases, to the success flow.

### Edge cases and alternate states
- **Unauthorized editor:** if the connected user is not the project owner/admin, the edit interface is blocked.
- **Cancelled project:** cancelled projects cannot proceed through the normal edit experience.
- **Project not found:** the user sees an unavailable/not-found style fallback.
- **Draft project publish flow:** if the project being edited is a draft and the user publishes it, the UI also activates the project.
- **No local-storage recovery in edit mode:** unlike create mode, edit mode is populated from backend project data rather than local-storage drafts.
- **Recipient-address rules still apply:** invalid or blocked address changes are prevented during edit just as they are during creation.

---

## 4) Manage Recipient Addresses (Add a Chain Address)

### Primary page / entry point
- **Entry point:** My Projects dashboard → project **Actions** → **Manage Addresses**
- **UI pattern:** modal flow
- **Goal:** Let the project owner add a missing recipient address for a supported chain.

### Happy path
1. The user opens **Manage Addresses** from a project card.
2. A modal opens showing the project title and the current list of supported chains.
3. For each chain, the modal shows the current address if one exists, or an **Add address** button if no address is set.
4. The user clicks **Add address** for a chain without an address.
5. The modal switches into chain-specific add mode and shows the selected chain context.
6. The user enters a receiving address for that chain.
7. The app validates the address according to chain type.
8. The user clicks **Save Address**.
9. The app submits the add-recipient-address mutation.
10. On success, the new address appears in the modal and the parent project state is updated.
11. The modal returns to the overview state so the user can review other chains.

### Edge cases and alternate states
- **Backend validation failure:** the API error is mapped back into the form so the user sees the problem inline.
- **Duplicate or invalid address:** the user cannot save until the entered value passes validation.
- **Stellar address flow:** the modal may request a memo in addition to the address.
- **Returning to overview without saving:** the user can navigate back from chain-specific add mode.
- **Chain already has an address:** the overview shows the saved address instead of an add action.
- **Address removal restrictions:** some chain addresses may not be removable if they are tied to active recurring-donation/anchor-contract behavior.

---

## 5) Activate Project

### Primary page / entry points
- **My Projects dashboard:** project **Actions** → **Activate Project**
- **Project page:** admin actions → **Activate Project**
- **Special CTA:** deactivated-project warning/toast may provide a reactivation path
- **Goal:** Return a non-active project to active status.

### Happy path
1. The user finds a project that is not currently active.
2. The user clicks **Activate Project**.
3. The UI submits the activate-project mutation.
4. The project state is refreshed or updated locally.
5. The project now appears as active again.

### Edge cases and alternate states
- **Not signed in from project page:** the UI first prompts the user to sign in before activating.
- **Dashboard path vs project-page path:**
  - dashboard activation updates local state immediately,
  - project-page activation refreshes the project from backend state.
- **Deactivation warning/toast disappears after activation:** once the project returns to active state, deactivation-related warnings are no longer shown.
- **Action availability depends on status:** activate is only shown when the project is not already active.

---

## 6) Deactivate Project

### Primary page / entry points
- **My Projects dashboard:** project **Actions** → **Deactivate Project**
- **Project page:** admin actions → **Deactivate Project**
- **Goal:** Let a project owner intentionally deactivate a project, with a reason captured through a guided modal flow.

### Happy path
1. The user clicks **Deactivate Project**.
2. A multi-step modal opens.
3. The user sees an introduction/confirmation step explaining the deactivation process.
4. The user proceeds to the **Why?** step.
5. The app fetches the list of available deactivation reasons.
6. The user selects a reason from the dropdown.
7. If needed, the user provides additional explanation.
8. The user confirms the deactivation.
9. The app submits the deactivate-project mutation.
10. On success, the modal advances to a **Done** state.
11. The user can then navigate to the public project list or back to My Account.

### Edge cases and alternate states
- **No reason selected:** confirmation remains disabled until the user chooses a reason.
- **Custom reason path:** when the selected reason requires extra detail, a free-text field appears.
- **Not signed in:** the app ensures the user is signed in before completing the deactivation mutation.
- **Dashboard vs project-page aftermath:**
  - dashboard updates the project card locally to the deactivated state,
  - project page refetches project data after success.
- **Post-deactivation warnings:** the project page shows a warning/toast indicating that the project is not active.
- **User cancels mid-flow:** the modal can be dismissed before submission, leaving the project unchanged.

---

## 7) Apply for Project Verification / Resume Verification

### Primary page / entry points
- **My Projects dashboard:** project **Actions** → **Verify Project** or **Resume Verification**
- **Project page:** admin actions → verification-related action
- **Project-page toast/CTA:** verification or resume-verification prompts may appear contextually
- **Verification route:** `/verification/[slug]`
- **Goal:** Start or resume the project verification workflow.

### Happy path
1. The user opens the verification flow from the dashboard or project page.
2. Depending on the entry point:
   - the dashboard may route directly to the verification page,
   - the project page may first show an explanatory modal with a proceed CTA.
3. The user lands on `/verification/[slug]`.
4. The app checks whether a verification form already exists.
5. If no verification form exists, the user starts at **Before you start**.
6. If a draft verification form already exists, the app restores the most relevant resume point.
7. The user proceeds through the verification sections in order:
   1. Before you start
   2. Personal info
   3. Social profiles (optional)
   4. Registration
   5. Project contact
   6. Impact
   7. Managing funds
   8. Terms / ToS
   9. Done
8. The user completes the required sections.
9. The app keeps the editable verification experience available while the verification form remains in draft status.

### Edge cases and alternate states
- **Verification action hidden or disabled:** verification entry points are not always available. The action may be unavailable when:
  - the project is already GIVbacks eligible,
  - verification was already submitted,
  - verification was rejected,
  - the project is not active.
- **Resume vs verify label:** the label changes depending on whether the project already has a draft verification form.
- **Local-storage resume behavior:** if a last-viewed step exists in local storage, the user resumes there first.
- **Computed resume behavior:** if no local step is stored, the app resumes at the first incomplete required section.
- **All required sections already completed but still draft:** the flow resumes near the final submission stage.
- **Submitted / non-draft verification state:** the page switches from an editable stepper flow to a status-report style view.
- **Start flow with no existing verification form:** clicking **Next** from the intro step creates the verification record before continuing.

---

## 8) Post Project Update

### Primary page / entry points
- **My Projects dashboard:** project **Actions** → **Add Update**
- **Project page:** open the **Updates** tab
- **Goal:** Let the project owner publish a new update on the project timeline.

### Happy path
1. The owner opens the project’s **Updates** tab.
2. The app shows the update composer only if the signed-in user is the project owner.
3. The owner enters:
   - an update title,
   - an update body in the rich text editor.
4. The owner clicks **Submit**.
5. The app validates the inputs.
6. The app submits the add-project-update mutation.
7. On success:
   - the title field is cleared,
   - the rich text editor is reset,
   - project updates are refetched,
   - project data is refetched,
   - a success toast confirms creation.

### Edge cases and alternate states
- **Non-owner viewer:** the user can read updates but does not see the composer.
- **Not signed in:** clicking submit triggers the sign-in flow instead of posting.
- **Empty body:** submission is blocked and an error toast is shown.
- **Empty title:** submission is blocked and an error toast is shown.
- **Rich text length limit exceeded:** submission is blocked if the body exceeds the configured limit.
- **Email not verified:** the Updates tab itself may be blocked in contexts where owner email verification is required for interaction.

---

## 9) Edit Project Update

### Primary page / entry point
- **Page:** project **Updates** tab
- **Goal:** Let the project owner edit an existing timeline update inline.

### Happy path
1. The owner opens the project’s Updates tab.
2. The owner locates an existing update in the timeline.
3. Because the current user is the owner, the update row shows **Edit** and **Remove** controls.
4. The owner clicks **Edit**.
5. That update row switches into inline edit mode:
   - the title becomes editable,
   - the body becomes a rich text editor seeded with the existing content.
6. The owner updates the title and/or body.
7. The owner clicks **Save**.
8. The app submits the edit-project-update mutation.
9. On success:
   - updates are refetched,
   - project data is refetched,
   - a success toast confirms the save,
   - the row exits edit mode.

### Edge cases and alternate states
- **Cancel edit:** clicking **Cancel** exits edit mode and restores the original saved title/body for that row.
- **Non-owner viewer:** edit controls do not appear.
- **Inline-only editing model:** editing happens inside the existing timeline row rather than on a separate page or modal.
- **Refresh-after-save behavior:** the timeline reflects the persisted backend state after the refetch completes.

---

## Cross-Flow Product Notes

### Shared access and ownership rules
- Many project-management actions require the user to be:
  - wallet connected,
  - signed in,
  - registered,
  - the project owner/admin.
- The UI often resolves these conditions before rendering the main form or mutation action.

### Shared project-management surfaces
- **My Projects dashboard** acts as the operational control center for owners.
- **Project page admin actions** provide contextual shortcuts for actions on a single project.
- **Modal flows** are used for focused tasks such as address management, deactivation, and some verification entry points.

### Key UX patterns repeated across the product
- Validation is usually shown inline for form fields and by toast for submission-level problems.
- Owner-only actions are hidden or disabled for non-owners.
- Status changes often trigger either:
  - a local optimistic/local-state update, or
  - a full project refetch to refresh canonical backend state.
- Draft-like workflows (project creation and verification) preserve progress through local storage and/or resumable server state.
