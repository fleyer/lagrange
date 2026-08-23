# Spec: Rename Contact → Reservation + Accommodation CTA

## Context

The "Contact" section is primarily used by visitors who want to book a stay — calling it "Contact" underrepresents its purpose. Renaming it to "Reservation" makes the booking intent immediately clear. Pairing this with a CTA button on the accommodations section creates a direct path from browsing to booking.

---

## Changes

### 1. Rename Contact section to Reservation

- Section ID changes from `#contact` to `#reservation`
- Navigation label changes to locale-appropriate reservation term (Réservation / Reservation / Reservierung / Reserva)
- No content change — address, phone, email, map stay the same
- Component file renamed from `ContactSection.astro` to `ReservationSection.astro`

### 2. CTA button on AccommodationsSection

- A "Book now" button appears below the pricing table
- Button links to `#reservation`
- Label is locale-aware via paraglide messages

---

## Acceptance criteria

- [ ] Nav link reads "Réservation" (FR), "Reservation" (EN), "Reservierung" (DE), "Reserva" (ES)
- [ ] Clicking the nav link scrolls to the reservation section
- [ ] Section ID is `#reservation` (not `#contact`)
- [ ] A CTA button is visible below the pricing table in the accommodations section
- [ ] CTA button links to `#reservation` and scrolls correctly
- [ ] `bun astro check` passes with no new errors
