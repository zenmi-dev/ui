import React, { use, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useClickOutside, useEventListener, useFirstRender, useResizeObserver, useThrottle } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'
import Icon from '../Icon'

declare namespace Dropdown {
  type Props = React.JSX.IntrinsicElements['div'] & {
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    trigger?: 'hover' | 'click'
    position?: 'left' | 'center' | 'right'
    offset?: number
  }
  type TriggerProps  = React.JSX.IntrinsicElements['div']
  type ContentProps  = React.JSX.IntrinsicElements['div']
}

const DropdownContext = React.createContext<{
  parent: React.RefObject<HTMLDivElement | null>
  open: boolean
  setOpen: (open: boolean) => void
  timer: React.RefObject<number>
} & Required<Pick<Dropdown.Props, 'trigger' | 'position' | 'offset'>> | null>(null)

function Dropdown(
  {
    open: propsOpen,
    onChangeOpen,
    trigger = 'hover',
    position = 'left',
    offset = 4,
    ...props
  }: Dropdown.Props
) {
  const [el, ref] = useComponentRef(props.ref)
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const timer = useRef(0)

  return (
    <div
      {...props}
      className={cls('ui-dropdown', {
        'ui-dropdown-open': open
      }, props.className)}
      ref={ref}
    >
      <DropdownContext.Provider value={{ parent: el, open, setOpen, timer, trigger, position, offset }}>
        {props.children}
      </DropdownContext.Provider>
    </div>
  )
}

function DropdownTrigger(props: Dropdown.TriggerProps) {
  const { setOpen, trigger, timer } = use(DropdownContext)!

  return (
    <div
      {...props}
      className={cls('ui-dropdown-trigger', props.className)}
      onMouseEnter={(e) => {
        if (trigger === 'hover') {
          window.setTimeout(() => window.clearTimeout(timer.current))
          setOpen(true)
        }
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (trigger === 'hover') {
          timer.current = window.setTimeout(() => setOpen(false), 200)
        }
        props.onMouseLeave?.(e)
      }}
      onClick={(e) => {
        if (trigger === 'click') {
          setOpen(true)
        }
        props.onClick?.(e)
      }}
    >
      <span>{props.children}</span>
      <Icon className='ui-dropdown-icon'>keyboard_arrow_down</Icon>
    </div>
  )
}

function DropdownContent(props: Dropdown.ContentProps) {
  const { parent, open, setOpen, timer, trigger, position, offset } = use(DropdownContext)!
  const firstRender = useFirstRender()
  const [el, ref] = useComponentRef(props.ref)
  const [close, setClose] = useState(!open)
  const [elStyle, setElStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.add('ui-dropdown-open')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.remove('ui-dropdown-open')
      el.current.addEventListener('transitionend', listener)
      return () => el.current?.removeEventListener('transitionend', listener)
    }
  }, [open])
  useEffect(() => {
    if (!close) {
      render()
    }
  }, [close])

  const render = useThrottle(() => {
    if (!parent.current || !el.current || !el.current.firstChild) {
      setOpen(false)
      return
    }
    const p = parent.current.getBoundingClientRect()
    if (!p.height && !p.width) {
      setOpen(false)
      return
    }
    let { height, width } = el.current.getBoundingClientRect()
    const child = el.current.firstChild.cloneNode(true) as HTMLElement
    document.body.appendChild(child)
    height += child.offsetHeight
    if (width < p.width) {
      width = p.width
    }
    child.remove()
    const style: any = {
      left: {
        top: p.bottom + offset,
        left: p.left
      },
      center: {
        top: p.bottom + offset,
        left: p.left + p.width / 2 - width / 2
      },
      right: {
        top: p.bottom + offset,
        left: p.left + p.width - width
      }
    }
    const elStyle = style[position]
    if (elStyle.top + height > window.innerHeight) {
      elStyle.top = p.top - height - offset
    }
    if (elStyle.left < 0) {
      elStyle.left = p.left
    } else if (elStyle.left + width > window.innerWidth) {
      elStyle.left = p.left + p.width - width
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
    elStyle.minWidth = width
    setElStyle(elStyle)
    el.current.classList.add('ui-dropdown-open')
  })

  useEventListener('resize', render)
  useResizeObserver(parent, render)
  useClickOutside(el, () => {
    if (trigger === 'click') {
      setOpen(false)
    }
  })

  return !firstRender && !close && createPortal((
    <div
      {...props}
      className={cls('ui-dropdown-content', props.className)}
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
      <div>{props.children}</div>
    </div>
  ), document.body)
}

Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent

export default Dropdown
