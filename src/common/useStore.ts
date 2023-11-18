import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ValueType = {
  rootPath: string
  mangas: string[]
}

type FunctionType = {
  setMangas: (mangas: string[]) => void
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
