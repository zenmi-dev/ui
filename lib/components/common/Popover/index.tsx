import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useClickOutside, useEventListener, useFirstRender, useResizeObserver, useThrottle } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'

declare namespace Popover {
  type Props = React.JSX.IntrinsicElements['div'] & {
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    trigger?: 'hover' | 'click' | 'focus'
    position?:
      'top' | 'top-left' | 'top-right' |
      'bottom' | 'bottom-left' | 'bottom-right' |
      'left' | 'left-top' | 'left-bottom' |
      'right' | 'right-top' | 'right-bottom'
    offset?: number
  }
}

function Popover(
  {
    open: propsOpen,
    onChangeOpen,
    trigger = 'hover',
    position = 'top',
    offset = 4,
    ...props
  }: Popover.Props
) {
  const firstRender = useFirstRender()
  const parent = useRef<HTMLElement>(null)
  const [el, ref] = useComponentRef(props.ref)
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const [close, setClose] = useState(!open)
  const [elStyle, setElStyle] = useState<React.CSSProperties>({})
  const timer = useRef(0)

  useEffect(() => {
    if (el.current) {
      parent.current = el.current.parentElement
    }
  }, [])
  useEffect(() => {
    if (!parent.current) {
      return
    }
    const open = () => setOpen(true)
    const close = () => {
      setOpen(false)
    }
    if (trigger === 'hover') {
      const openListener = () => {
        window.setTimeout(() => window.clearTimeout(timer.current))
        open()
      }
      const closeListener = () => {
        timer.current = window.setTimeout(close, 200)
      }
      parent.current.addEventListener('mouseenter', openListener)
      parent.current.addEventListener('mouseleave', closeListener)
      return () => {
        parent.current?.removeEventListener('mouseenter', openListener)
        parent.current?.removeEventListener('mouseleave', closeListener)
      }
    } else if (trigger === 'click') {
      parent.current.addEventListener('click', open)
      return () => parent.current?.removeEventListener('click', open)
    } else if (trigger === 'focus') {
      parent.current.addEventListener('focus', open)
      parent.current.addEventListener('focusout', close)
      return () => {
        parent.current?.removeEventListener('focus', open)
        parent.current?.removeEventListener('focusout', close)
      }
    }
  }, [trigger])
  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.remove('ui-popover-close')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.add('ui-popover-close')
      el.current.addEventListener('animationend', listener)
      return () => el.current?.removeEventListener('animationend', listener)
    }
  }, [open])
  useEffect(() => {
    if (!firstRender && !close) {
      render()
    }
  }, [firstRender, close])

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
    const { height, width } = el.current.getBoundingClientRect()
    const style: any = {
      'top': {
        top: p.top - height - offset,
        left: p.left + p.width / 2 - width / 2
      },
      'top-left': {
        top: p.top - height - offset,
        left: p.left
      },
      'top-right': {
        top: p.top - height - offset,
        left: p.left + p.width - width,
      },
      'bottom': {
        top: p.bottom + offset,
        left: p.left + p.width / 2 - width / 2
      },
      'bottom-left': {
        top: p.bottom + offset,
        left: p.left
      },
      'bottom-right': {
        top: p.bottom + offset,
        left: p.left + p.width - width
      },
      'left': {
        top: p.top + p.height / 2 - height / 2,
        left: p.left - width - offset
      },
      'left-top': {
        top: p.top,
        left: p.left - width - offset
      },
      'left-bottom': {
        top: p.top + p.height - height,
        left: p.left - width - offset
      },
      'right': {
        top: p.top + p.height / 2 - height / 2,
        left: p.right + offset
      },
      'right-top': {
        top: p.top,
        left: p.right + offset
      },
      'right-bottom': {
        top: p.top + p.height - height,
        left: p.right + offset
      }
    }
    let newPosition: string = position
    let elStyle = style[position]
    if (elStyle.top < 0) {
      newPosition = newPosition.replace(/^top/, 'bottom')
      newPosition = newPosition.replace(/(?<=^(left|right))(|-bottom)$/, '-top')
    } else if (elStyle.top + height > window.innerHeight) {
      newPosition = newPosition.replace(/^bottom/, 'top')
      newPosition = newPosition.replace(/(?<=^(left|right))(|-top)$/, '-bottom')
    }
    if (elStyle.left < 0) {
      newPosition = newPosition.replace(/^left/, 'right')
      newPosition = newPosition.replace(/(?<=^(top|bottom))(|-right)$/, '-left')
    } else if (elStyle.left + width > window.innerWidth) {
      newPosition = newPosition.replace(/^right/, 'left')
      newPosition = newPosition.replace(/(?<=^(top|bottom))(|-left)$/, '-right')
    }
    elStyle = style[newPosition]
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

  useEventListener('resize', render)
  useResizeObserver(parent, render)
  useClickOutside(el, () => {
    if (trigger === 'click') {
      setOpen(false)
    }
  })

  return firstRender ? (
    <div ref={el} hidden></div>
  ) : !close && createPortal((
    <div
      {...props}
      className={cls('ui-popover', props.className)}
      style={{ ...elStyle, ...props.style }}
      ref={ref}
      onMouseEnter={(e) => {
        if (trigger === 'hover') {
          window.setTimeout(() => window.clearTimeout(timer.current))
        }
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (trigger === 'hover') {
          timer.current = window.setTimeout(() => setOpen(false), 200)
        }
        props.onMouseLeave?.(e)
      }}
    >
      {props.children}
    </div>
  ), document.body)
}

export default Popover
