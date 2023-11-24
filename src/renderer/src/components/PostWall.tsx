import { MangaType, useStore } from '@renderer/common/useStore'
import Grid from 'react-virtualized/dist/es/Grid'
import MangaPost from './MangaPost'
import { FAVORITE_SYMBOL } from '@renderer/common/constants'
import { useEffect, useMemo } from 'react'

export type PostWallType = {
  width: number
  height: number
}

const zip = (data: MangaType[], count = 7) => {
  let temp: MangaType[] = []
  const result: MangaType[][] = []
  data.forEach((item) => {
    temp.push(item)
    if (temp.length === count) {
      result.push([...temp])
      temp = []
    }
  })

  if (temp.length > 0) {
    result.push([...temp])
  }
  return result
}

function filterMangas(mangas, search, favorites) {
  if (search.includes(FAVORITE_SYMBOL)) {
    console.log('zou favorites')
    const fav = mangas.filter((manga) => favorites.includes(manga.path))
    console.log('fav', fav)
    return fav
  }
  if (search.length) {
    return mangas.filter((manga) =>
      search.some((tag) => manga.path.toLocaleLowerCase().includes(tag.toLocaleLowerCase()))
    )
  }
  return mangas
}

const PostWall = (props: PostWallType) => {
  const mangas = useStore((state) => state.mangas)
  const search = useStore((state) => state.search)
  const favorites = useStore((state) => state.favorites)

  const list = useMemo(() => {
    return zip(filterMangas(mangas, search, favorites))
  }, [mangas, search, favorites])

  function cell({ columnIndex, rowIndex, key, style }) {
    const data = list[rowIndex][columnIndex]
    return (
      <div style={style} className="p-1">
        <MangaPost key={key} {...data} />
      </div>
    )
  }
  useEffect(() => {
    console.log(list)
  }, [list])

  return (
    list.length > 0 && (
      <Grid
        cellRenderer={cell}
        columnCount={list[0].length}
        columnWidth={props.width / 7}
        rowCount={list.length}
        rowHeight={(props.width / 7) * 1.42}
        height={props.height}
        width={props.width}
      />
    )
  )
}

export default PostWall
