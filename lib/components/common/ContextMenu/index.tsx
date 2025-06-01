import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useClickOutside, useEventListener, useFirstRender, useResizeObserver, useThrottle } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'

declare namespace ContextMenu {
  type Props = React.JSX.IntrinsicElements['div'] & {
    onChangeOpen?: (open: boolean) => any
  }
}

function ContextMenu(
  {
    onChangeOpen,
    ...props
  }: ContextMenu.Props
) {
  const firstRender = useFirstRender()
  const parent = useRef<HTMLElement>(null)
  const [el, ref] = useComponentRef(props.ref)
  const [open, setOpen] = useStateListner(void 0 as any, onChangeOpen)
  const [close, setClose] = useState(!open)
  const [elStyle, setElStyle] = useState<React.CSSProperties>({})
  const [position, setPosition] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (el.current) {
      parent.current = el.current.parentElement
    }
  }, [])
  useEffect(() => {
    if (!parent.current) {
      return
    }
    const open = (e: MouseEvent) => {
      e.preventDefault()
      setOpen(true)
      setPosition([e.clientX, e.clientY])
    }
    parent.current.addEventListener('contextmenu', open)
    return () => parent.current?.removeEventListener('contextmenu', open)
  }, [])
  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.remove('ui-context-menu-close')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.add('ui-context-menu-close')
      el.current.addEventListener('animationend', listener)
      return () => el.current?.removeEventListener('animationend', listener)
    }
  }, [open])
  useEffect(() => {
    if (!firstRender && !close) {
      render()
    }
  }, [firstRender, close, position])

  const render = useThrottle(() => {
    if (!parent.current || !el.current) {
      setOpen(false)
      return
    }
    const p = parent.current.getBoundingClientRect()
    if (!p.height && !p.width) {
      setOpen(false)
      return
    }
    const [left, top] = position
    const { height, width } = el.current.getBoundingClientRect()
    const elStyle = { top, left }
    if (elStyle.top + height > window.innerHeight) {
      elStyle.top = top - height
    }
    if (elStyle.left + width > window.innerWidth) {
      elStyle.left = left - width
    }
    if (elStyle.top + height > window.innerHeight) {
      elStyle.top = window.innerHeight - height
    }
    if (elStyle.top < 0) {
      elStyle.top = 0
    }
    if (elStyle.left + width > window.innerWidth) {
      elStyle.left = window.innerWidth - width
    }
    if (elStyle.left < 0) {
      elStyle.left = 0
    }
    setElStyle(elStyle)
  })

  useEventListener('resize', () => setOpen(false))
  useResizeObserver(parent, () => setOpen(false))
  useClickOutside(el, () => setOpen(false))

  return firstRender ? (
    <div ref={el} hidden></div>
  ) : !close && createPortal((
    <div
      {...props}
      className={cls('ui-context-menu', props.className)}
      style={{ ...elStyle, ...props.style }}
      ref={ref}
    >
      {props.children}
    </div>
  ), document.body)
}

export default ContextMenu
