# 🤖 G-Screenshot Auto-Cleaner

> **Automatically deletes your local screenshots after you paste them into Gemini — like iOS verification codes that vanish after autofill.**

When you press `Prt Sc` on Windows, the screenshot is saved locally forever. This tool watches that folder and deletes the screenshot the moment it detects you've pasted it into Gemini — completely silently.

---

## How It Works

This tool has two parts that work together:

1. **Chrome Extension** — Watches the Gemini web page. The moment it detects you paste an image (via a MutationObserver on Gemini's image preview), it sends a signal to the local server.
2. **Local Server** — A tiny Node.js server running on your machine at `http://127.0.0.1:13337`. When it receives the signal, it finds the most recently created screenshot (if less than 5 minutes old) and deletes it.

---

## Setup (One-time)

### Step 1: Install the Local Server

> Requires [Node.js](https://nodejs.org/) installed on your PC.

1. Download or clone this repo.
2. Open a terminal inside the `server/` folder and run:
   ```bash
   npm install
   ```
3. Start the server:
   - **With a visible window (for testing):** Double-click `start-server.bat`
   - **Completely hidden (recommended):** Double-click `start-hidden.vbs` — no window, no noise, runs silently.

> **💡 Tip:** To make it auto-start on every boot, create a shortcut of `start-hidden.vbs` and place it in your Windows Startup folder. Press `Win + R` and type `shell:startup` to open it.

### Step 2: Install the Chrome Extension

1. Go to `chrome://extensions/` in Chrome or Edge.
2. Enable **Developer Mode** (top-right toggle).
3. Click **"Load unpacked"** and select the `extension/` folder from this repo.

---

## Usage

1. Press `Prt Sc` to take a screenshot (it saves to `Pictures\Screenshots`).
2. Open [Gemini](https://gemini.google.com) and paste it with `Ctrl + V`.
3. Done — the local screenshot file is automatically deleted! 🗑️

---

## File Structure

```
gemini-screenshot-cleanup/
├── extension/          # Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── icon.png
├── server/             # Local Node.js Server
│   ├── server.js
│   ├── watcher.js
│   ├── start-server.bat
│   └── start-hidden.vbs
└── .gitignore
```

---

## Privacy

- The extension only activates on `gemini.google.com`.
- The local server only listens on `127.0.0.1` (your own machine) — no data ever leaves your PC.
- No API keys, no accounts, no cloud.

---

## License

MIT — free to use, share, and modify.
