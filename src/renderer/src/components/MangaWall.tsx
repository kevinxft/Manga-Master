import { useStore } from '@renderer/common/useStore'
import MangaPost from './MangaPost'

function MangaWall(): JSX.Element {
  const mangas = useStore((state) => state.mangas)
  return (
    <div className="h-screen w-[100%] overflow-y-auto scroll-smooth">
      <div className="grid gap-2 p-2 min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12">
        {mangas.map((manga) => (
          <MangaPost key={manga.path} {...manga} />
        ))}
      </div>
    </div>
  )
}

export default MangaWall
