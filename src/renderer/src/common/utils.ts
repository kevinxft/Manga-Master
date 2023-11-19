export async function traverseFolder(directory: string) {
  const result = await window.electron.ipcRenderer.invoke('traverse-folder', directory)
  return result
}
