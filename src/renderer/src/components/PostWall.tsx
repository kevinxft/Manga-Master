import { MangaType, useStore } from '@renderer/common/useStore'
import Grid from 'react-virtualized/dist/es/Grid'
import MangaPost from './MangaPost'
import { FAVORITE_SYMBOL } from '@renderer/common/constants'
import { useImperativeHandle, useMemo, useRef } from 'react'

const getRowCount = (width: number) => {
  const count = Math.max(Math.floor(width / 230), 1)
  return count
}

export type PostWallType = {
  width: number
  height: number
}

export type PostWallFunc = {
  toTop: () => void
  toBottom: () => void
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

const PostWall = ({ width, height }: PostWallType, ref) => {
  const mangas = useStore((state) => state.mangas)
  const search = useStore((state) => state.search)
  const favorites = useStore((state) => state.favorites)

  const gridRef = useRef<Grid>(null)

  useImperativeHandle(
    ref,
    (): PostWallFunc => ({
      toTop() {
        gridRef.current?.scrollToPosition({ scrollTop: 0, scrollLeft: 0 })
      },
      toBottom() {
        const { rowCount = 0, rowHeight = 0, height = 0 } = gridRef.current?.props || {}
        gridRef.current?.scrollToPosition({
          scrollTop: rowCount * (rowHeight as number) - height,
          scrollLeft: 0
        })
      }
    }),
    []
  )

  const list = useMemo(() => {
    return zip(filterMangas(mangas, search, favorites))
  }, [mangas, search, favorites])

  function cell({ columnIndex, rowIndex, key, style }) {
    const data = list[rowIndex][columnIndex]
    return data ? (
      <div style={style} className="p-1">
        <MangaPost key={key} {...data} />
      </div>
    ) : null
  }

  const rowCount = getRowCount(width)
  const columnWidth = width / rowCount
  const rowHeight = columnWidth * 1.42

  return (
    list.length > 0 && (
      <Grid
        ref={gridRef}
        overscanColumnCount={rowCount * 3}
        cellRenderer={cell}
        columnCount={list && list[0] ? list[0].length : 1}
        columnWidth={columnWidth}
        rowCount={list?.length || 1}
        rowHeight={rowHeight}
        height={height}
        width={width}
        scrollToRow={0}
      />
    )
  )
}

export default PostWall
