import type React from "react"
import { cn } from "@/lib/utils"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Simple markdown-like rendering (basic support)
  const renderContent = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent: string[] = []
    let codeLanguage = ""

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
          codeContent = []
        } else {
          inCodeBlock = false
          elements.push(
            <pre key={index} className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
              <code className="text-sm font-mono">{codeContent.join("\n")}</code>
            </pre>,
          )
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold mt-6 mb-3">
            {line.slice(4)}
          </h3>,
        )
        return
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-semibold mt-8 mb-4">
            {line.slice(3)}
          </h2>,
        )
        return
      }
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-2xl font-bold mt-8 mb-4">
            {line.slice(2)}
          </h1>,
        )
        return
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.slice(2)
        elements.push(
          <li key={index} className="ml-4 list-disc text-muted-foreground">
            {renderInlineFormatting(content)}
          </li>,
        )
        return
      }

      // Empty lines
      if (line.trim() === "") {
        elements.push(<br key={index} />)
        return
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {renderInlineFormatting(line)}
        </p>,
      )
    })

    return elements
  }

  const renderInlineFormatting = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    text = text.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links
    text = text.replace(
      /\[(.*?)\]$$(.*?)$$/g,
      '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return (
    <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>{renderContent(content)}</div>
  )
}
