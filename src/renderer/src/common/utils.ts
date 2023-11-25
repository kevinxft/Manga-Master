export async function traverseFolder(directory: string) {
  const result = await window.electron.ipcRenderer.invoke('traverse-folder', directory)
  return result
}

function extractNestedTexts(text) {
  const result: string[] = []
  const regex = /[\\[(](.*?)[\])]|\(([^()]*\([^()]*\)[^()]*)*\)/g

  let matches
  while ((matches = regex.exec(text)) !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const matchedText = matches[0]
    const innerText = matches[1] || matches[2] // 获取括号内的文本

    if (innerText) {
      result.push(innerText.trim())
    }
  }

  return result
}

export async function generateTags(array) {
  const tags = new Set()
  array.forEach((dir) => {
    const directory = dir.path.split('/').pop()
    const result = extractNestedTexts(directory)
    result.forEach((tag) => {
      if (!tags.has(tag)) {
        tags.add(tag)
      }
    })
  })
  return Array.from(tags)
}

function scanMangas(rootPath, callback) {
  window.electron.ipcRenderer.send('scan-mangas', rootPath)
  window.electron.ipcRenderer.on('reply-mangas', (_, result) => {
    callback(result)
  })
}

export async function initMangas(rootPath, callback, done) {
  scanMangas(rootPath, async (result) => {
    callback(result.data)
    if (result.done) {
      const tags = await generateTags(result.data)
      done(tags)
    }
  })
}

export async function syncMangas(rootPath, done) {
  scanMangas(rootPath, async (result) => {
    if (result.done) {
      const tags = await generateTags(result.data)
      done(result.data, tags)
    }
  })
}
