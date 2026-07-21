# C chromatic tab shooter

An interactive application that generates chromatic harmonica tablature using a realistic piano keyboard interface and a rich text editor.

## What's New in This Version:
- **Title Placeholder & First Row Fix:** Following user feedback, the app now pre-fills the text box with "Title: Your Song" upon loading or clearing. Because the editor is never truly empty, the browser's engine stops panicking at index 0, which entirely neutralizes the first-row line break glitch.
- **Hard Enter Override:** The application now intercepts the "Enter" key globally and forces the browser to output a strict line break (`<br>`) instead of letting the browser attempt to create nesting block divs. This guarantees perfectly uniform line breaks no matter what row you are on.
- **Light Brown / Beige Color Scheme:** Maintained the beautiful, low-contrast acoustic aesthetic requested in previous versions.

## How to Run
This is a standard frontend web project with no dependencies. 

1. Unzip the project folder.
2. Open `index.html` in any modern web browser.
3. Use your physical keyboard to type or press `Enter`, and use your mouse to play the piano keys to insert tablature. 

## Tablature Notation Guide
- `n` = Blow hole `n` (e.g., `4`)
- `-n` = Draw hole `n` (e.g., `-4`)
- `(n)` = Blow hole `n` with button pressed (e.g., `(4)`)
- `(-n)` = Draw hole `n` with button pressed (e.g., `(-4)`)
