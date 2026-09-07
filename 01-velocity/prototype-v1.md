# Prototype v1: First Build (Lab 1)

> Module 1 · Velocity. Fifteen minutes from a vague problem to a clickable, shareable URL, instinct over methodology.

## Scenario

_Which of the four scenarios (or your own, instructor-approved) did you build?_

The Marketplace Trust Problem
Marketplace bookings have flattened because buyers hesitate to take a chance on providers with no reviews, and that missing trust blocks new providers from getting started. You prototype a trust-building mechanism that helps new providers earn a first booking and unlock marketplace liquidity.

_____

## Launch path

- [X] Copy & Customize (start from a scenario starter prompt)
- [ ] First Screen Method (build only the very first screen the user sees)

## The build

- **What I built:** A single-page provider profile for a freelance-professional marketplace (Roster). The page answers: what does a buyer see when a provider has zero reviews? Core mechanic is a **Trust layer ON/OFF toggle** that strips all verification content so a Show & Swap partner can see the A/B instantly without verbal setup. Trust-ON state shows: a 5-of-6 verification ring with six clickable badge receipts (government ID, employment history, portfolio provenance, business registration, E&O insurance, payout account — the last one deliberately pending with a simulate-verification button that animates the ring to 6/6). Supporting trust signals: four identity-verified vouches with expandable quotes and relationship proofs; imported reputation (4.9★ on Toptal, 11 LinkedIn recommendations); a single on-platform review with escrow receipt; and reliability stats shown at full resolution with the N labelled honestly (*n = 1 engagement — too little to prove consistency, shown so you can judge for yourself*). An explicit "What we can't tell you yet" block admits limits before buyers ask. Risk reversal: founding-client escrow guarantee with a slot counter (2 of 5 remaining). Three-step booking modal with protections review and success state. File: `01-velocity/prototype-v1/index.html` — self-contained, no dependencies, no network calls.
- **Tool used:** Claude Code (Anthropic) — single-file HTML, vanilla CSS + JS, inline SVG
- **Shareable link:** https://vibesharing.app/view/9a50c46d-519f-4e5f-8520-a8ea09f377e7

## Show & Swap read

_What a partner understood from your build with no verbal setup. Their reaction is your first piece of product evidence._

- **What they thought it did:** It is a page like a resume (like LinkedIn), and it is also about having verified.
- **What surprised them:** Why prices are there, what is the overall purpose of the product.
- **The assumption they thought you were testing:** Solving problems about trustability
- **The gap between what you intended and what they read:** The purpose of the product was not so clear, but what it is testing was spot on.

