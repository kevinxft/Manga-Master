import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { CUSTOM_PREFIX } from './constants'

const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp)$/i

let newWin
let preUrl

type MangaType = {
  path: string
  post: string
}

const traverse = async (dir, mangas: MangaType[] = []) => {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath, mangas)
    } else {
      if (imageExtensionRegex.test(file)) {
        console.log(file)
        mangas.push({
          path: dir,
          post: `${CUSTOM_PREFIX}://` + path.join(dir, file)
        })
        break
      }
    }
  }
  return mangas
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

  ipcMain.on('open-window', function (_, url) {
    if (!newWin) {
      newWin = new BrowserWindow({
        width: 900,
        height: 620,
        autoHideMenuBar: true
      })
    }
    if (newWin && preUrl === url) {
      newWin.focus()
      return
    }
    preUrl = url
    newWin.loadURL(url)
    newWin.on('closed', () => {
      newWin = null
    })
  })
}
