import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

const traverse = async (dir, mangas: string[] = []) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)

    if (fs.statSync(fullPath).isDirectory()) {
      console.log(fullPath)
      traverse(fullPath, mangas)
    }
  })
}

export const initEvents = (mainWindow: BrowserWindow) => {
  ipcMain.handle('select-folder', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
      console.log(result)
      if (!result.canceled) {
        return result.filePaths[0]
      }
      return ''
    } catch (error) {
      console.log(error)
      return ''
    }
  })

  ipcMain.handle('traverse-folder', async (_, path) => {
    try {
      const all = traverse(path)
      return all
    } catch (error) {
      console.error(error)
      return []
    }
  })
}
