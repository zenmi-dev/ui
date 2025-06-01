import React, { useEffect, useState } from 'react'
import { Icon, Popover, Tabs } from '../../lib/components'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

declare namespace Example {
  type Props = {
    examples?: Item[]
  }
  type Item = {
    name?: string
    code: string
    element: React.ReactNode
    center?: boolean
  }
}

function Example(
  {
    examples
  }: Example.Props
) {
  const [activeKey, setActiveKey] = useState('0')

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return !!examples?.length && (
    <>
      <Tabs
        className='example-tabs'
        activeKey={activeKey.replace(/^code/, '')}
        onChangeActiveKey={(key) => setActiveKey(activeKey.startsWith('code') ? `code${key}` : key)}
      >
        <Tabs.List>
          {examples.map((x, i) => (
            <Tabs.Trigger key={i}>{x.name || 'Example'}</Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>
      <Tabs
        className='example-tabs'
        activeKey={activeKey}
        onChangeActiveKey={setActiveKey}
      >
        {examples.map((x, i) => (
          <Tabs.Content key={i} className='example-content'>
            {x.center ? (
              <div className='flex justify-center'>
                {x.element}
              </div>
            ) : (
              x.element
            )}
            <Icon className='example-code-icon' onClick={() => setActiveKey(`code${i}`)}>
              code
              <Popover className='example-code-popover'>Show Code</Popover>
            </Icon>
          </Tabs.Content>
        ))}
        {examples.map((x, i) => (
          <Tabs.Content
            key={`code${i}`}
            className='example-code'
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault()
                const codeEl = (e.target as HTMLElement).querySelector('code')
                if (codeEl) {
                  const range = document.createRange()
                  const selection = window.getSelection()
                  if (selection) {
                    selection.removeAllRanges()
                    range.selectNode(codeEl)
                    selection.addRange(range)
                  }
                }
              }
            }}
          >
            <pre>
              <code className='language-tsx'>
                {x.code.trim()}
              </code>
            </pre>
            <Icon className='example-code-icon' onClick={() => setActiveKey(String(i))}>
              code_off
              <Popover className='example-code-popover'>Hide Code</Popover>
            </Icon>
          </Tabs.Content>
        ))}
      </Tabs>
    </>
  )
}

export default Example
