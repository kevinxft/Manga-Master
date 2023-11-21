import { BrowserWindow, dialog, ipcMain, screen } from 'electron'
import fs from 'fs'
import path, { join } from 'path'
import { CUSTOM_PREFIX } from './constants'
import { is } from '@electron-toolkit/utils'

const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp)$/i

const appendPrefix = (path) => {
  return `${CUSTOM_PREFIX}://` + path
}

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
          post: appendPrefix(path.join(dir, file))
        })
        break
      }
    }
  }
  return mangas
}

const getAllImg = async (dir: string) => {
  const result: string[] = []
  fs.readdirSync(dir).forEach((file) => {
    if (imageExtensionRegex.test(file)) {
      result.push(appendPrefix(path.join(dir, file)))
    }
  })
  return result
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

  ipcMain.handle('get-imgs', async (_, path) => {
    console.log(path)
    const all = await getAllImg(path)
    return all
  })

  ipcMain.handle('exit-gallary', async () => {
    newWin && newWin.close()
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
    if (newWin && preUrl === url) {
      newWin.focus()
      return
    } else {
      newWin && newWin.close()
    }
    const display = screen.getDisplayMatching(mainWindow.getBounds())
    newWin = new BrowserWindow({
      width: display.workArea.width,
      height: display.workArea.height,
      x: display.workArea.x,
      y: display.workArea.y,
      title: 'Gallary',
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    // is.dev && newWin.webContents.openDevTools()

    preUrl = url
    newWin.loadURL(url)
    newWin.focus()
    newWin.on('closed', () => {
      console.log('新窗口被关闭')
      newWin = null
    })
  })
}
