import { Link } from './link'

export const LinkStories = () => {
  return (
    <>
      <h2>Basic Link:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path">Click me</Link>
        <Link path="another/note">Another note</Link>
      </div>

      <h2>Link with Icon:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path" icon="link">
          Link with icon
        </Link>
        <Link path="some/note/path" icon="file-text">
          Note with file icon
        </Link>
        <Link path="some/note/path" icon="calendar">
          Calendar note
        </Link>
      </div>

      <h2>Link with Tooltip:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path" tooltip="This is a helpful tooltip">
          Hover me
        </Link>
        <Link path="some/note/path" icon="info" tooltip="Information note">
          Info link
        </Link>
      </div>

      <h2>Custom Styling:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path" className="text-red-500">
          Custom color
        </Link>
        <Link
          path="some/note/path"
          icon="star"
          iconClassName="text-yellow-500"
        >
          Custom icon color
        </Link>
        <Link
          path="some/note/path"
          wrapperClassName="bg-blue-500 p-2 rounded"
        >
          Custom wrapper
        </Link>
      </div>

      <h2>Different Paths:</h2>
      <div className="flex flex-col gap-2">
        <Link path="daily/2024-01-01">Daily note</Link>
        <Link path="projects/my-project">Project note</Link>
        <Link path="notes/meeting-notes">Meeting notes</Link>
      </div>
    </>
  )
}
