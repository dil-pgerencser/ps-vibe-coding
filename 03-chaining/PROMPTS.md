# PROMPTS.md: Living Prompt Pack

> Module 3 · Prompt Chaining. Re-architect the build with prompt chains; capture the reusable ones here.

End result: https://vibesharing.app/view/5ab1f9ed-4549-4c36-9444-9b6c08f3646a

## How to use this pack

_Each prompt is a reusable step. Chain them: the output of one becomes the input to the next._

## Prompt chain: [name your flow]

### Step 1: Expand, build new screens in a strict sequence
```
Build the next phase of this app in a strict sequence.
The Browse New Talent list view is the reference for the marketplace/list experience. The Marcus Reid detail view is the reference for the freelancer profile experience.

Preserve the existing visual language exactly: cool light-gray background, white cards, navy typography, green verification states, rounded cards and pills, thin borders, spacing, and information density.

1. Add a new screen ("Profile Loading") that appears after clicking "View profile" on a freelancer in the Browse New Talent list. Match the existing product styling and show the freelancer profile loading, including profile information and trust signals.
2. Add a new screen ("Verification Detail") reached by clicking a verification item or the 5/6 verification ring on the Marcus Reid profile. Match the existing detail-view styling. Show all six verification categories with clear verified, pending, and unavailable states, plus a concise explanation of what each verification actually proves.
3. Add a new screen ("Booking Error") that can be reached from the existing booking flow when booking cannot be completed. Match the existing product styling and clearly explain what went wrong, with a retry action that returns the user to the booking flow.

Navigation:
Browse New Talent -> View profile -> Profile Loading -> Marcus Reid Detail View → Verification Detail

From the existing Marcus Reid Detail View, "Request first project" / "Book now" should continue into the existing booking flow, which can lead to Booking Error or the existing successful confirmation state.

Build these in order. Use the existing Browse New Talent and Marcus Reid detail views as the visual North Stars. Do not redesign or replace either existing screen.

Do not add unrelated features or new product concepts.
```

### Step 2: Behavior, hard-code the states
```
Apply the following logic constraints to the freelancer profile and booking flow:

- Use a loading state for the Profile Loading screen while profile, verification, reputation, and reliability information is being retrieved.
- If no marketplace reviews are present, show the empty state:
  "No client reviews yet. This freelancer is new to the marketplace. Here's what we can verify instead."
- If verification information is unavailable, show the error state:
  "Some verification information is temporarily unavailable. We couldn't confirm one or more signals right now. Other verified information is still available."
- Provide a "Retry verification" action from the verification error state.
- When the user selects the 5/6 verification ring or an individual verification badge, open the verification-detail state showing all six categories and clearly distinguishing verified, pending, and unavailable states.
- The six verification categories are: Government ID, Employment History, Portfolio Provenance, Business Registration, E&O Insurance, and Payout Account.
- The "Request project" action must lead into the existing three-step booking flow.
- If booking cannot be completed, show an error state explaining the failure and provide a retry action.
- On successful booking, show the existing booking success / confirmation state and clearly communicate the next step.

Maintain the same design language throughout and tether all behavior strictly to these rules.
```

### Step 3: Refine, one surgical polish
```
The 5/6 verification ring needs a professional surgical polish.

1. Start by listing the 3 biggest gaps in its typography, hierarchy, spacing, clarity, or interaction compared to the attached reference screenshot.
2. Once you have identified those three gaps, resize, reposition, or update only the verification ring and its immediate supporting elements to address them.

Don't change anything else in the project or touch the underlying logic.
```

# PROMPTS.md: Living Prompt Pack

> Module 3 · Prompt Chaining. Re-architect the build with prompt chains; capture the reusable ones here.

## How to use this pack

_Each prompt is a reusable step. Chain them: the output of one becomes the input to the next._

## Prompt chain: [name your flow]

### Step 1: Expand, build new screens in a strict sequence
```
Build the next phase of this app in a strict sequence.
The Browse New Talent list view is the reference for the marketplace/list experience. The Marcus Reid detail view is the reference for the freelancer profile experience.

Preserve the existing visual language exactly: cool light-gray background, white cards, navy typography, green verification states, rounded cards and pills, thin borders, spacing, and information density.

1. Add a new screen ("Profile Loading") that appears after clicking "View profile" on a freelancer in the Browse New Talent list. Match the existing product styling and show the freelancer profile loading, including profile information and trust signals.
2. Add a new screen ("Verification Detail") reached by clicking a verification item or the 5/6 verification ring on the Marcus Reid profile. Match the existing detail-view styling. Show all six verification categories with clear verified, pending, and unavailable states, plus a concise explanation of what each verification actually proves.
3. Add a new screen ("Booking Error") that can be reached from the existing booking flow when booking cannot be completed. Match the existing product styling and clearly explain what went wrong, with a retry action that returns the user to the booking flow.

Navigation:
Browse New Talent → View profile → Profile Loading → Marcus Reid Detail View → Verification Detail

From the existing Marcus Reid Detail View, "Request first project" / "Book now" should continue into the existing booking flow, which can lead to Booking Error or the existing successful confirmation state.

Build these in order. Use the existing Browse New Talent and Marcus Reid detail views as the visual North Stars. Do not redesign or replace either existing screen.

Do not add unrelated features or new product concepts.
```

### Step 2: Behavior, hard-code the states
```
Apply the following logic constraints to the freelancer profile and booking flow:

- Use a loading state for the Profile Loading screen while profile, verification, reputation, and reliability information is being retrieved.
- If no marketplace reviews are present, show the empty state:
  "No client reviews yet. This freelancer is new to the marketplace. Here's what we can verify instead."
- If verification information is unavailable, show the error state:
  "Some verification information is temporarily unavailable. We couldn't confirm one or more signals right now. Other verified information is still available."
- Provide a "Retry verification" action from the verification error state.
- When the user selects the 5/6 verification ring or an individual verification badge, open the verification-detail state showing all six categories and clearly distinguishing verified, pending, and unavailable states.
- The six verification categories are: Government ID, Employment History, Portfolio Provenance, Business Registration, E&O Insurance, and Payout Account.
- The "Request project" action must lead into the existing three-step booking flow.
- If booking cannot be completed, show an error state explaining the failure and provide a retry action.
- On successful booking, show the existing booking success / confirmation state and clearly communicate the next step.

Maintain the same design language throughout and tether all behavior strictly to these rules.
```

### Step 3: Refine, one surgical polish
```
The 5/6 verification ring needs a professional surgical polish.

1. Start by listing the 3 biggest gaps in its typography, hierarchy, spacing, clarity, or interaction compared to the attached reference screenshot.
2. Once you have identified those three gaps, resize, reposition, or update only the verification ring and its immediate supporting elements to address them.

Don't change anything else in the project or touch the underlying logic.
```

## Reusable techniques learned

- Using an existing screen as a visual anchor keeps new screens consistent with the current product language.
- Naming the exact screen and element to change prevents the AI from unnecessarily redesigning the rest of the product.
- Breaking the work into Expand -> Behavior -> Refine makes it easier to control scope and verify each change before moving on.
- Writing exact loading, empty, error, and success states makes prototype behavior more reproducible than describing behavior generally.
- Keeping the hypothesis and existing product logic in every prompt prevents the AI from adding unrelated features.

## What broke (and the fix)

_Where a single mega-prompt failed and chaining fixed it._

Nothing broke. The main risk was scope drift from a single mega-prompt. Chaining fixed this by separating screen expansion, behavior, and visual refinement into three controlled passes.
