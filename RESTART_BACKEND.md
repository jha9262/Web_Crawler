# How to Restart Backend in IntelliJ IDEA

## Method 1: Restart from IntelliJ (Easiest)

1. **Stop the current application:**
   - In IntelliJ, look at the bottom toolbar
   - Find the running application (should show "WebCrawlBackendApplication")
   - Click the red square (Stop) button, or press `Ctrl+F2`

2. **Rebuild the project:**
   - Press `Ctrl+Shift+F9` (Rebuild Project)
   - OR go to: **Build** → **Rebuild Project**

3. **Run the application again:**
   - Press `Shift+F10` (Run)
   - OR click the green play button
   - OR right-click `WebCrawlBackendApplication.java` → **Run**

## Method 2: If Maven is installed

If you want to use Maven from command line, you need to:
1. Install Maven first
2. Add it to PATH
3. Then use: `cd backend` then `mvn clean spring-boot:run`

But since you're using IntelliJ, Method 1 is easier!

## Quick Steps:
1. Stop app (red square button)
2. Rebuild (Ctrl+Shift+F9)
3. Run again (green play button)

That's it! The new JWT filter will be loaded.

