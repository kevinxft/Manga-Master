import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MangaType = {
  path: string
  post: string
}

type ValueType = {
  rootPath: string
  mangas: MangaType[]
  search: string[]
  tags: string[]
  autoTags: string[]
  favorites: string[]
}

type FunctionType = {
  setMangas: (mangas: MangaType[]) => void
  setRootPath: (rootPath: string) => void
  setSearch: (search: string[]) => void
  setTags: (tags: string[]) => void
  setAutoTags: (autoTags: string[]) => void
  setFavorites: (favorites: string[]) => void
}

const initState = {
  rootPath: '',
  mangas: [],
  search: [],
  tags: [],
  autoTags: [],
  favorites: []
}

export const useStore = create<ValueType & FunctionType>()(
  persist(
    (set) => ({
      ...initState,
      setMangas: (mangas) => set({ mangas }),
      setRootPath: (rootPath) => set({ rootPath }),
      setSearch: (search) => set({ search }),
      setTags: (tags) => set({ tags }),
      setAutoTags: (autoTags) => set({ autoTags }),
      setFavorites: (favorites) => set({ favorites })
    }),
    {
      name: 'Manga-Master'
    }
  )
)
