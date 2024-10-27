import { BrowserWindow, dialog, ipcMain, screen } from 'electron'
import fs from 'fs'
import path, { join } from 'path'

const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i

const appendPrefix = (path: string) => {
  return 'file://' + path
}

const getMTime = (dir: string) => {
  return new Date(fs.statSync(dir).mtime).getTime()
}

let newWin: BrowserWindow | null
let preUrl: string
let isScaning = false
let mainWindow: BrowserWindow
let isInit = false

type MangaType = {
  path: string
  post: string
  mtime: number
}

const traverse = async (dir: string, mangas: MangaType[] = []) => {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath, mangas)
    } else {
      if (imageExtensionRegex.test(file)) {
        mangas.push({
          path: dir,
          post: appendPrefix(path.join(dir, file)),
          mtime: getMTime(dir)
        })
        break
      }
    }
  }
  return mangas
}

const traverseMangas = (dir, callback) => {
  const mangas: MangaType[] = []
  let count = 0
  const traverse = async (directory) => {
    const files = await fs.promises.readdir(directory)
    for (const file of files) {
      const fullPath = path.join(directory, file)
      if (fs.statSync(fullPath).isDirectory()) {
        await traverse(fullPath)
      } else {
        if (imageExtensionRegex.test(file)) {
          mangas.push({
            path: directory,
            post: appendPrefix(path.join(directory, file)),
            mtime: getMTime(directory)
          })
          count++
          if (mangas.length > 0 && count % 50 === 0) {
            callback({
              data: [...mangas],
              done: false
            })
            count = 0
          }
          break
        }
      }
    }
  }
  traverse(dir).then(() => {
    callback({
      data: [...mangas],
      done: true
    })
    isScaning = false
  })
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

export const initEvents = (_mainWindow: BrowserWindow) => {
  mainWindow = _mainWindow
  if (isInit) {
    return
  }
  isInit = true

  ipcMain.on('scan-mangas', async (event, path) => {
    if (isScaning) {
      return
    }
    isScaning = true
    await traverseMangas(path, (result) => {
      event.sender.send('reply-mangas', result)
    })
  })

  ipcMain.handle('select-folder', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
      if (!result.canceled) {
        return result.filePaths[0]
      }
      return ''
    } catch (error) {
      return ''
    }
  })

  ipcMain.handle('get-imgs', async (_, path) => {
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
    }
    newWin && newWin.close()
    const display = screen.getDisplayMatching(mainWindow.getBounds())
    newWin = new BrowserWindow({
      width: display.workArea.width,
      height: display.workArea.height,
      x: display.workArea.x,
      y: display.workArea.y,
      titleBarStyle: 'hiddenInset',
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false,
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    // is.dev && newWin.webContents.openDevTools()

    preUrl = url
    newWin.loadURL(url)
    newWin.focus()
    newWin.on('closed', () => {
      newWin = null
    })
  })
}
