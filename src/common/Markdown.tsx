import { useEffect, useRef, useState } from 'react'
import Container from './Container'
import { marked } from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

declare namespace Markdown {
  type Props = {
    file: string
    fullWidth?: boolean
  }
}

function Markdown(
  {
    file,
    fullWidth = true
  }: Markdown.Props
) {
  const el = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then((text) => {
        setHtml(marked.parse(text) as string)
      })
  }, [])
  useEffect(() => {
    Prism.highlightAll()
  }, [html])

  return html && (
    <Container fullWidth={fullWidth} headingSelectors='h2'>
      <div
        ref={el}
        className='markdown'
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </Container>
  )
}

export default Markdown
