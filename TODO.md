# TODO: Implement Text Above Image Layout in Hero Section

> **Status:** Archived. All active tasks have been consolidated into `PROJECT_TASK_STATUS.md`. This file is kept for historical reference only.

## Steps to Complete

- [x] Update `src/sections/home/index.tsx`:
  - Change background image from `/Untitled design (1).png` to `/bg-image.jpg` (plain background without characters).
  - Adjust hero section layout: Remove `justify-center`, add `justify-start` and `pt-16` to position text block at the top.
  - Add character images as a horizontal row in the character div using the four JPG files (`9881382.jpg`, `14140043_5384286.jpg`, `42113142_8899769.jpg`, `91730735_10058509.jpg`), with appropriate sizing and spacing for full visibility.

- [x] Verify text formatting in `src/sections/home/content/home-title.tsx`:
  - Confirm headline is in two lines: "FIND YOUR PERFECT CAREER PATH" and "WITH REAL-TIME GUIDANCE", centered.

- [ ] Verify button placement in `src/sections/home/content/home-info-grid.tsx`:
  - Ensure "Get Started" and "Book a Mentor" buttons are centered beneath the text.

- [x] Test layout:
  - Run development server to check readability, visual balance, and spacing.
  - Ensure no overlap: Text and buttons above, images below with sufficient gap.
  - Test responsiveness on different screen sizes.

- [x] Adjust if needed:
  - Fine-tune image sizes, spacing, or padding for full character visibility and alignment.
