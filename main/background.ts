import path from 'path';
import { app, ipcMain, Menu } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import fs from 'fs';

// Determine if the app is in production
const isProd = process.env.NODE_ENV === 'production';

// Path to the notes.json file in the app's user data directory
const dataPath = path.join(app.getPath('userData'), 'notes.json');
console.log('Data Path:', dataPath);

// Ensure that the notes.json file exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// Serve the app in production or development
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

// App initialization and window creation
(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Disable the application menu
  Menu.setApplicationMenu(null);

  if (isProd) {
    await mainWindow.loadURL('app://.');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

// Quit app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler to read notes from notes.json
ipcMain.handle('get-notes', async () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
});

// IPC handler to save notes to notes.json
ipcMain.handle('save-notes', async (_event, notes) => {
  try {
    // Save the notes to the notes.json file
    fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
    console.log('Notes saved successfully');
  } catch (error) {
    console.error('Error saving notes:', error);
  }
});

// Error handling if the app fails to load
// app.on('error', (error) => {
//   console.error('Error in Electron app:', error);
// });
