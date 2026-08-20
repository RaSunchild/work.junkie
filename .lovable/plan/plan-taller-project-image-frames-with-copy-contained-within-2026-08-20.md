# Plan: Taller Project Image Frames with Copy Contained Within the Same Height

## Current state

- The project blocks on `/` render an image frame on one side and a text column on the other.
- The image frame height is currently clamped to `h-[clamp(460px,88svh,1200px)]` on desktop and the text column is given `md:min-h-[clamp(460px,88svh,1200px)]` to match.
- The reference render shows the image frame occupying a much larger share of the viewport height, and the category, title, and "Explore" link all sitting within that same vertical span without overflowing above the frame.
- The selected element in the preview is the first image placeholder div inside the project blocks section (`src/routes/index.tsx` around line 636).

## What we will change

1. Increase the desktop image frame height so it takes up a greater viewport height.
2. Keep the text column vertically aligned to the same height as the image frame.
3. Ensure the text copy (category, title, "Explore") is distributed within that height, not overflowing above it.
4. Preserve the existing responsive behavior on mobile.

## Technical approach

- Edit `src/routes/index.tsx` in the project blocks section.
- Replace the desktop image height clamp with a taller value (e.g. closer to 100svh or a larger max).
- Apply the same height to the text column via `min-h` so the two columns share a common vertical boundary.
- Use `justify-between` or equivalent vertical distribution to keep the category, title, and CTA within the frame height.
- Avoid touching block data, scroll-snap logic, or other unrelated sections.

## Out of scope

- No data changes (titles, categories, slugs, images) unless the layout reveals a missing image for the Exposure block.
- No changes to colors, fonts, or animation timing.
- No changes to other routes.

## Deliverables

- Updated `src/routes/index.tsx` matching the reference layout.
- Verified desktop preview where the Exposure frame is taller and the text sits within the frame height.
