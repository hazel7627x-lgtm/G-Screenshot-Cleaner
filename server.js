const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());

const PORT = 13337;

// Function to find the absolute path of the user's Screenshots folder
function getScreenshotsFolders() {
  const home = os.homedir();
  return [
    path.join(home, 'Pictures', 'Screenshots'),
    path.join(home, 'OneDrive', 'Pictures', 'Screenshots'),
    path.join(home, 'OneDrive', '图片', '屏幕截图')
  ].filter(fp => fs.existsSync(fp));
}

// Find the newest screenshot created within the last 5 minutes
function deleteLatestScreenshot() {
  const folders = getScreenshotsFolders();
  let newestFile = null;
  let newestTime = 0;

  folders.forEach(folder => {
    try {
      const files = fs.readdirSync(folder);
      files.forEach(file => {
        const fullPath = path.join(folder, file);
        const stats = fs.statSync(fullPath);
        
        // Only images
        if (stats.isFile() && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
          // Find the most recently created file
          if (stats.birthtimeMs > newestTime) {
            newestTime = stats.birthtimeMs;
            newestFile = fullPath;
          }
        }
      });
    } catch (e) {
      console.error(`Error reading ${folder}:`, e);
    }
  });

  if (newestFile) {
    const fiveMinutes = 5 * 60 * 1000;
    const now = Date.now();
    // Only delete if it's less than 5 minutes old to prevent accidentally deleting old important images
    if (now - newestTime < fiveMinutes) {
      try {
        fs.unlinkSync(newestFile);
        console.log(`[DELETED] Automatically cleaned up: ${newestFile}`);
        return { success: true, message: 'Deleted latest screenshot', file: newestFile };
      } catch (err) {
        console.error(`Error deleting file:`, err);
        return { success: false, message: 'Failed to delete file', error: err.message };
      }
    } else {
      console.log(`[IGNORED] Newest screenshot is older than 5 minutes. Skipping delete. (${newestFile})`);
      return { success: false, message: 'Screenshot is too old (> 5 mins)' };
    }
  } else {
    console.log('[INFO] No screenshots found to delete.');
    return { success: false, message: 'No screenshot found' };
  }
}

app.post('/cleanup', (req, res) => {
  console.log('[API] /cleanup Triggered by Gemini Paste/Drop event');
  const result = deleteLatestScreenshot();
  res.json(result);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`===============================================`);
  console.log(`🚀 G-Screenshot Auto-Cleaner Server is RUNNING`);
  console.log(`Listening on http://127.0.0.1:${PORT}`);
  console.log(`Keep this window open! Every time you paste a screenshot into Gemini, it will be automatically deleted here.`);
  console.log(`===============================================`);
});
