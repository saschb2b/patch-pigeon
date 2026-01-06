import type React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { SxProps, Theme } from "@mui/material/styles"

interface MarkdownContentProps {
  content: string
  sx?: SxProps<Theme>
}

export function MarkdownContent({ content, sx }: MarkdownContentProps) {
  // Simple markdown-like rendering (basic support)
  const renderContent = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeContent: string[] = []

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeContent = []
        } else {
          inCodeBlock = false
          elements.push(
            <Box
              component="pre"
              key={index}
              sx={{
                bgcolor: "action.hover",
                borderRadius: 2,
                p: 2,
                overflowX: "auto",
                my: 2,
              }}
            >
              <Box
                component="code"
                sx={{
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                }}
              >
                {codeContent.join("\n")}
              </Box>
            </Box>,
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
          <Typography
            key={index}
            variant="h6"
            component="h3"
            sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}
          >
            {line.slice(4)}
          </Typography>,
        )
        return
      }
      if (line.startsWith("## ")) {
        elements.push(
          <Typography
            key={index}
            variant="h5"
            component="h2"
            sx={{ fontWeight: 600, mt: 4, mb: 2 }}
          >
            {line.slice(3)}
          </Typography>,
        )
        return
      }
      if (line.startsWith("# ")) {
        elements.push(
          <Typography
            key={index}
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mt: 4, mb: 2 }}
          >
            {line.slice(2)}
          </Typography>,
        )
        return
      }

      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const itemContent = line.slice(2)
        elements.push(
          <Box
            component="li"
            key={index}
            sx={{
              ml: 2,
              listStyleType: "disc",
              color: "text.secondary",
            }}
          >
            {renderInlineFormatting(itemContent)}
          </Box>,
        )
        return
      }

      // Empty lines
      if (line.trim() === "") {
        elements.push(<Box component="br" key={index} />)
        return
      }

      // Regular paragraphs
      elements.push(
        <Typography
          key={index}
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          {renderInlineFormatting(line)}
        </Typography>,
      )
    })

    return elements
  }

  const renderInlineFormatting = (text: string) => {
    // Bold
    let processedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    processedText = processedText.replace(
      /`(.*?)`/g,
      '<code style="background-color: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.875rem; font-family: monospace;">$1</code>',
    )
    // Links
    processedText = processedText.replace(
      /\[(.*?)\]$$(.*?)$$/g,
      '<a href="$2" style="color: #1f2937; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    return <span dangerouslySetInnerHTML={{ __html: processedText }} />
  }

  return (
    <Box
      sx={{
        maxWidth: "none",
        "& ul, & ol": {
          pl: 2,
          mb: 2,
        },
        ...sx,
      }}
    >
      {renderContent(content)}
    </Box>
  )
}
