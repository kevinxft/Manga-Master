import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MangaType = {
  path: string
  post: string
  mtime: number
}

type ValueType = {
  rootPath: string
  mangas: MangaType[]
  search: string[]
  tags: string[]
  autoTags: string[]
  favorites: string[]
  sorted: boolean
  interval: number
  foldGallaryTools: boolean
}

type FunctionType = {
  setMangas: (mangas: MangaType[]) => void
  setRootPath: (rootPath: string) => void
  setSearch: (search: string[]) => void
  setTags: (tags: string[]) => void
  setAutoTags: (autoTags: string[]) => void
  setFavorites: (favorites: string[]) => void
  toggleSorted: () => void
  setInterval: (interval: number) => void
  toggleFoldGallaryTools: () => void
}

const initState = {
  rootPath: '',
  mangas: [],
  search: [],
  tags: [],
  autoTags: [],
  favorites: [],
  sorted: true,
  interval: 3,
  foldGallaryTools: false
}

export const useStore = create<ValueType & FunctionType>()(
  persist(
    (set, get) => ({
      ...initState,
      setMangas: (mangas) => set({ mangas }),
      setRootPath: (rootPath) => set({ rootPath }),
      setSearch: (search) => set({ search }),
      setTags: (tags) => set({ tags }),
      setAutoTags: (autoTags) => set({ autoTags }),
      setFavorites: (favorites) => set({ favorites }),
      toggleSorted: () => set({ sorted: !get().sorted }),
      setInterval: (interval) => set({ interval }),
      toggleFoldGallaryTools: () => set({ foldGallaryTools: !get().foldGallaryTools })
    }),
    {
      name: 'Manga-Master'
    }
  )
)
