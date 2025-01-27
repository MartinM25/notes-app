import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },

  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    };
  },

  // Method for retrieving notes from main process
  getNotes() {
    return ipcRenderer.invoke('get-notes');
  },

  // Method for saving notes to the main process
  saveNotes(notes: unknown) {
    return ipcRenderer.invoke('save-notes', notes);
  }
}

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
