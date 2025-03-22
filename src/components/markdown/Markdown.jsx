import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaCopy } from 'react-icons/fa' // Import the copy icon
import { toaster } from '../ui/toaster'


function MarkdownDisplay({ markdownContent }) {

  const handleCopy = text => {
    navigator.clipboard.writeText(text)
    toaster.create({
      description: 'Copied to clipboard',
      type: 'success',
      duration: 3000
    })

  }

  return (
    <ReactMarkdown
      children={markdownContent}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const codeText = String(children).replace(/\n$/, '')

          return !inline && match ? (
            <div style={{ position: 'relative' }}>
              <SyntaxHighlighter
                children={codeText}
                style={dracula}
                language={match[1]}
                PreTag='div'
                {...props}
              />
              <button
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'transparent',
                  border: 'none',
                  padding: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => handleCopy(codeText)}
              >
                <FaCopy />
              </button>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    />
  )
}

export default MarkdownDisplay
