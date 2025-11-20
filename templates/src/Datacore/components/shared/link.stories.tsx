import { Link } from './link'

export const LinkStories = () => {
  return (
    <>
      <h2>Basic Links (using path):</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path">Click me</Link>
        <Link path="another/note">Another note</Link>
        <Link path="daily/2024-01-01">Daily note</Link>
        <Link path="projects/my-project">Project note</Link>
      </div>

      <h2>Links with Custom Display:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path">Custom display text</Link>
        <Link path="another/note">Different label than path</Link>
      </div>

      <h2>Custom Styling with className:</h2>
      <div className="flex flex-col gap-2">
        <Link path="some/note/path" className="text-red-500 font-bold">
          Red and bold link
        </Link>
        <Link path="some/note/path" className="text-blue-600 underline">
          Blue underlined link
        </Link>
        <Link path="some/note/path" className="text-green-700 italic">
          Green italic link
        </Link>
      </div>

      <h2>Different Vault Paths:</h2>
      <div className="flex flex-col gap-2">
        <Link path="notes/meeting-notes">Meeting notes</Link>
        <Link path="references/books/sapiens">Book reference</Link>
        <Link path="work/projects/2024-q1">Quarterly project</Link>
      </div>
    </>
  )
}
