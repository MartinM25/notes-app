import path from 'path';
import { app, ipcMain, Menu } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

// Path to the notes.json file
const dataPath = path.join(app.getPath('userData'), 'notes.json');
console.log('Data Path:', dataPath);

// Ensure the notes.json file exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  Menu.setApplicationMenu(null);

  if (isProd) {
    await mainWindow.loadURL('app://.');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
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
    fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
});

// ipcMain.on('message', async (event, arg) => {
//   event.reply('message', `${arg} World!`);
// });
