# Tutorial Images Guide

This guide shows you which images to create/capture for each tutorial step.

## Current Setup
All tutorial steps are configured to look for images in: `public/tutorial/` folder

**IMPORTANT:** In Next.js, files in the `public` folder are served from the root URL.
- ✅ Correct path: `/tutorial/welcome.png`
- ❌ Wrong path: `../public/tutorial/welcome.png` or `./public/tutorial/welcome.png`

## Image Recommendations

### Step 1: Welcome Screen
**File to replace:** Step 1 image  
**Suggestion:** Capture a full screenshot of your Ubuntu portfolio homepage  
**What to show:** The entire desktop interface with some apps visible

### Step 2: The Top Navigation Bar
**File to replace:** Step 2 image  
**Suggestion:** Capture a screenshot focusing on the top navbar  
**What to show:** The navbar with "Activities", clock, and status icons highlighted

### Step 3: The Sidebar - App Launcher
**File to replace:** Step 3 image  
**Suggestion:** Capture a screenshot of the left sidebar  
**What to show:** The sidebar with app icons and the grid icon at the bottom

### Step 4: Desktop Shortcuts
**File to replace:** Step 4 image  
**Suggestion:** Capture desktop icons  
**What to show:** Desktop area with visible app shortcuts (AI Assistant, Chrome, etc.)

### Step 5: Application Windows
**File to replace:** Step 5 image  
**Suggestion:** Capture an open application window  
**What to show:** A window with visible controls (minimize, maximize, close buttons)

### Step 6: Right-Click Context Menus
**File to replace:** Step 6 image  
**Suggestion:** Capture a right-click context menu  
**What to show:** Desktop with context menu open showing available options

### Step 7: Settings & Customization
**File to replace:** Step 7 image  
**Suggestion:** Capture the settings/status dropdown  
**What to show:** The status menu dropdown with settings, lock, power options

### Step 8: Explore Applications
**File to replace:** Step 8 image  
**Suggestion:** Capture the all applications view  
**What to show:** The full app grid or multiple apps open

### Step 9: Tips & Tricks
**File to replace:** Step 9 image  
**Suggestion:** Create a diagram or capture multiple features  
**What to show:** Various UI elements in action (minimized windows, shortcuts, etc.)

### Step 10: Ready to Explore
**File to replace:** Step 10 image  
**Suggestion:** A welcoming final image  
**What to show:** Full desktop ready for exploration, or the tutorial button highlighted

## How to Add Your Tutorial Images

1. Create/capture your screenshots (recommended size: 1200x800px or similar aspect ratio)
2. Save them in `public/tutorial/` folder with these names:
   - `welcome.png` - Welcome screen
   - **Step 2 has NO image - navbar is highlighted**
   - `ai-assistant.png` - AI Assistant app
   - `about-helmi.png` - About Helmi app
   - `vscode.png` - Visual Studio Code
   - `spotify.png` - Spotify player
   - `settings.png` - Settings panel
   - `face-gesture.png` - Face Gesture Control
   - `contact.png` - Contact Me form
   - `youtube.png` - CS1994 YouTube channel
   - `racing.png` - Racing Game
   - `calculator.png` - Calculator app
   - `terminal.png` - Terminal app
   - `tips.png` - Tips and tricks
   - `finish.png` - Final screen

3. The paths are already configured in the code - just add your images with the correct filenames!

**Your folder structure should look like:**
```
public/
└── tutorial/
    ├── welcome.png
    ├── ai-assistant.png
    ├── about-helmi.png
    ├── vscode.png
    ├── spotify.png
    ├── settings.png
    ├── face-gesture.png
    ├── contact.png
    ├── youtube.png
    ├── racing.png
    ├── calculator.png
    ├── terminal.png
    ├── tips.png
    └── finish.png
```

## Image Format Recommendations
- **Format:** PNG or JPG
- **Dimensions:** 1200x800px (3:2 ratio) or 1920x1080px (16:9)
- **File size:** Keep under 500KB for fast loading
- **Optimization:** Use image compression tools before adding to project

## Tips for Capturing Screenshots
1. Use Windows Snipping Tool (Win + Shift + S)
2. Capture at 1920x1080 resolution for best quality
3. Add arrows or annotations to highlight specific features (optional)
4. Ensure good contrast and visibility of UI elements
5. Consider creating a dedicated tutorial folder structure:
   ```
   public/images/tutorials/
   ├── step1-welcome.png
   ├── step2-navbar.png
   ├── step3-sidebar.png
   └── ...
   ```
