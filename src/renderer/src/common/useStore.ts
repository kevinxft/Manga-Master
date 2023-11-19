import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MangaType = {
  path: string
  post: string
}

type ValueType = {
  rootPath: string
  mangas: MangaType[]
}

type FunctionType = {
  setMangas: (mangas: MangaType[]) => void
  setRootPath: (rootPath: string) => void
}

const initState = {
  rootPath: '',
  mangas: []
}

export const useStore = create<ValueType & FunctionType>()(
  persist(
    (set) => ({
      ...initState,
      setMangas: (mangas) => set({ mangas }),
      setRootPath: (rootPath) => set({ rootPath })
    }),
    {
      name: 'Manga-Master'
    }
  )
)
