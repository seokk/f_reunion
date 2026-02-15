import type { ReactNode } from "react"

function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[2] && match[3]) {
      parts.push(
        <a
          key={`link-${key++}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {match[2]}
        </a>,
      )
    } else if (match[4]) {
      parts.push(
        <strong key={`strong-${key++}`} className="font-semibold">
          {match[4]}
        </strong>,
      )
    }

    lastIndex = tokenRegex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export function PolicyMarkdown({ text }: { text: string }) {
  const lines = text.split("\n")
  const elements: ReactNode[] = []
  let listBuffer: { type: "ol" | "ul"; item: string }[] = []
  let key = 0

  const flushList = () => {
    if (listBuffer.length === 0) return

    const isOrdered = listBuffer[0].type === "ol"
    const items = listBuffer.map((entry, index) => (
      <li key={`li-${key++}-${index}`}>{parseInline(entry.item)}</li>
    ))

    elements.push(
      isOrdered ? (
        <ol key={`ol-${key++}`} className="ml-6 list-decimal space-y-1">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${key++}`} className="ml-6 list-disc space-y-1">
          {items}
        </ul>
      ),
    )
    listBuffer = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushList()
      elements.push(<div key={`sp-${key++}`} className="h-3" />)
      continue
    }

    const h1 = line.match(/^#\s+(.+)$/)
    if (h1) {
      flushList()
      elements.push(
        <h1 key={`h1-${key++}`} className="text-3xl font-bold md:text-4xl">
          {parseInline(h1[1])}
        </h1>,
      )
      continue
    }

    const h3 = line.match(/^###\s+(.+)$/)
    if (h3) {
      flushList()
      elements.push(
        <h3 key={`h3-${key++}`} className="text-lg font-semibold md:text-xl">
          {parseInline(h3[1])}
        </h3>,
      )
      continue
    }

    const ol = line.match(/^\d+\.\s+(.+)$/)
    if (ol) {
      listBuffer.push({ type: "ol", item: ol[1] })
      continue
    }

    const ul = line.match(/^-\s+(.+)$/)
    if (ul) {
      listBuffer.push({ type: "ul", item: ul[1] })
      continue
    }

    flushList()
    elements.push(
      <p key={`p-${key++}`} className="leading-7 text-foreground/90">
        {parseInline(line)}
      </p>,
    )
  }

  flushList()

  return <article className="space-y-1 text-sm md:text-base">{elements}</article>
}
