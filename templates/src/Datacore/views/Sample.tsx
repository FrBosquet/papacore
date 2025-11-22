/**
 * Sample View Component
 *
 * This is a simple example view that demonstrates:
 * - Using Datacore queries to fetch pages
 * - Basic Preact component structure
 * - Tailwind CSS styling
 *
 * To use this view in your vault:
 * 1. Create a markdown file
 * 2. Add a datacore code block:
 * ```datacore
 * const { Sample } = await dc.require("views/Sample.jsx")
 * return <Sample />
 * ```
 */

export const Sample = () => {
  // Example: Query all pages in your vault
  // Uncomment the line below to use it
  // const pages = dc.useQuery("#tag")

  return (
    <article className="flex flex-col gap-4 p-4">
      <header>
        <h1 className="text-2xl font-bold text-theme-accent">Sample View</h1>
        <p className="text-primary-400">
          This is a sample view component. Edit this file to create your own view!
        </p>
      </header>

      <section className="bg-primary-950 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
        <ul className="list-disc list-inside space-y-1 text-primary-300">
          <li>Use <code className="bg-primary-900 px-1 rounded">dc.useQuery()</code> to fetch pages from your vault</li>
          <li>Install papacore cli to easily access helpers <code className="bg-primary-900 px-1 rounded">npm install -g papacore</code></li>
          <li>Install components with <code className="bg-primary-900 px-1 rounded">papacore install button</code></li>
          <li>Use Tailwind CSS classes for styling</li>
          <li>Use papacore to customise your theme <code className="bg-primary-900 px-1 rounded">papacore theme set-color primary 335566</code></li>
          <li>Check out the stories files for component examples</li>
        </ul>
      </section>

      <section className="bg-primary-950 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Example Query</h2>
        <pre className="bg-primary-900 p-2 rounded overflow-x-auto">
          <code className="text-sm text-green-400">
            {`const pages = dc.useQuery("#project")
return pages.map(page => (
  <div key={page.$path}>
    {page.$name}
  </div>
))`}
          </code>
        </pre>
      </section>
    </article>
  )
}
