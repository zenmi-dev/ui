import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useFirstRender } from '../../../hooks/index.js'
import { useComponentRef } from '../../tools'

declare namespace Overlay {
  type Props = React.JSX.IntrinsicElements['div'] & {
    open?: boolean
  }
}

let overlayCount = 0

function Overlay(
  {
    open,
    ...props
  }: Overlay.Props
) {
  const firstRender = useFirstRender()
  const [el, ref] = useComponentRef(props.ref)
  const [close, setClose] = useState(!open)
  const bodyStyleRef = useRef<string | null>(null)

  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.remove('ui-overlay-close')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.add('ui-overlay-close')
      el.current.addEventListener('animationend', listener)
      return () => el.current?.removeEventListener('animationend', listener)
    }
  }, [open])
  useEffect(() => {
    if (open) {
      function getScrollbarWidth() {
        const outer = document.createElement('div')
        outer.style.visibility = 'hidden'
        outer.style.overflow = 'scroll'
        document.body.appendChild(outer)
        const inner = document.createElement('div')
        outer.appendChild(inner)
        const width = (outer.offsetWidth - inner.offsetWidth)
        outer.remove()
        return width
      }
      overlayCount += 1
      if (overlayCount === 1 && document.body.scrollHeight > window.innerHeight) {
        bodyStyleRef.current = document.body.getAttribute('style')
        document.body.style.overflow = 'hidden'
        const p = parseFloat(getComputedStyle(document.body).marginRight)
        document.body.style.marginRight = `${p + getScrollbarWidth()}px`
      }
      return () => {
        overlayCount -= 1
        if (!overlayCount) {
          if (bodyStyleRef.current === null) {
            document.body.removeAttribute('style')
          } else {
            document.body.style = bodyStyleRef.current
          }
        }
      }
    }
  }, [open])

  return !firstRender && !close && createPortal((
    <div
      {...props}
      className={cls('ui-overlay', props.className)}
      ref={ref}
    >
      {props.children}
    </div>
  ), document.body)
}

export default Overlay
