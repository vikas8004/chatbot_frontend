import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaCopy } from 'react-icons/fa'
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
        p: ({ node, children }) => (
          <p style={{ fontSize: '13px', fontWeight: '500', color: '#ddd' }}>
            {children}
          </p>
        ),
        li: ({ node, children }) => (
          <li style={{ fontSize: '13px', fontWeight: '500', color: '#ddd' }}>
            {children}
          </li>
        ),
        h1: ({ node, children }) => (
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
            {children}
          </h1>
        ),
        h2: ({ node, children }) => (
          <h2 style={{ fontSize: '24px', fontWeight: '750', color: '#eee' }}>
            {children}
          </h2>
        ),
        h3: ({ node, children }) => (
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#eee' }}>
            {children}
          </h3>
        ),
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
                customStyle={{
                  fontSize: '12px',
                  fontWeight: '300',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#282a36'
                }}
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
                <FaCopy size={14} />
              </button>
            </div>
          ) : (
            <code
              className={className}
              {...props}
              style={{
                fontSize: '12px',
                fontWeight: '400',
                background: '#2d2d2d',
                padding: '2px 4px',
                borderRadius: '4px'
              }}
            >
              {children}
            </code>
          )
        }
      }}
    />
  )
}

export default MarkdownDisplay
