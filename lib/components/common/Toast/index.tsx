import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useFirstRender, useThrottle } from '../../../hooks/index.js'
import Icon from '../Icon'

export declare namespace Toast {
  type Props = Omit<React.JSX.IntrinsicElements['div'], 'ref'> & {
    ref: React.Ref<API>,
    position?: Position
  }
  type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  type API = {
    open: (options: Options) => number
    close: (id: number) => void,
    clear: () => void
  }
  type Options = {
    type?: 'info' | 'success' | 'error' | 'warning' | 'loading'
    title?: React.ReactNode
    description?: React.ReactNode
    duration?: number
  }
  interface useToast {
    (options?: {
      position?: Position
    }): [API, React.ReactNode]
  }
}

function Toast(
  {
    ref,
    position = 'top-right',
    ...props
  }: Toast.Props
) {
  const firstRender = useFirstRender()
  const el = useRef<HTMLDivElement>(null)
  const itemRef = useRef<Record<number, HTMLDivElement | null>>({})
  const ids = useRef<number[]>([])
  const [items, setItems] = useState<({ id: number } & Toast.Options)[]>([])
  const [update, setUpdate] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!items.length) {
      setHover(false)
    }
  }, [items])
  useEffect(() => {
    render()
  }, [update, hover])

  const render = useThrottle(() => {
    if (!el.current) {
      return
    }
    el.current.removeAttribute('style')
    for (let i = 0; i < ids.current.length; i++) {
      const itemEl = itemRef.current[ids.current[i]]
      if (itemEl) {
        itemEl.style.removeProperty('transform')
        itemEl.style.removeProperty('opacity')
      }
    }
    const property: 'top' | 'bottom' = position.includes('top') ? 'top' : 'bottom'
    let totalHeight = 0
    if (hover) {
      for (let i = 0; i < ids.current.length; i++) {
        const itemEl = itemRef.current[ids.current[i]]
        if (itemEl) {
          itemEl.style[property] = `${totalHeight}px`
          const { height } = itemEl.getBoundingClientRect()
          totalHeight += height + 12
        }
      }
    } else {
      for (let i = 0; i < ids.current.length; i++) {
        const itemEl = itemRef.current[ids.current[i]]
        if (itemEl) {
          if (i === 0) {
            const { height } = itemEl.getBoundingClientRect()
            totalHeight = height
            itemEl.style[property] = '0px'
          } else if (i < 3) {
            itemEl.style[property] = `${6 * i}px`
            itemEl.style.transform = `scale(${1 - 0.025 * i})`
            totalHeight += 6
          } else {
            itemEl.style[property] = '0px'
            itemEl.style.opacity = '0'
          }
        }
      }
    }
    if (totalHeight) {
      el.current.style.height = `${totalHeight}px`
    }
  })
  const open = (options: Toast.Options) => {
    const id = ids.current.length ? ids.current[0] + 1 : 0
    ids.current.unshift(id)
    const newItem = { id, ...options }
    setItems((prev) => [...prev, newItem])
    setUpdate((prev) => prev + 1)
    const { duration = 5000 } = options
    if (duration) {
      window.setTimeout(() => close(id), duration)
    }
    return id
  }
  const close = (id: number) => {
    const itemEl = itemRef.current[id]
    if (itemEl && !itemEl.classList.contains('ui-toast-close')) {
      const listener = () => setItems((prev) => prev.filter((x) => x.id !== id))
      itemEl.classList.add('ui-toast-close')
      itemEl.addEventListener('animationend', listener)
      ids.current = ids.current.filter((x) => x !== id)
      setUpdate((prev) => prev + 1)
    }
  }
  const clear = () => {
    for (let key in Object.keys(itemRef.current)) {
      close(Number(key))
    }
  }

  useImperativeHandle(ref, () => ({ el: el.current, open, close, clear }))

  return !firstRender && !!items?.length && createPortal((
    <div
      {...props}
      className={cls('ui-toast', {
        [`ui-toast-${position}`]: position
      }, props.className)}
      ref={el}
      onMouseEnter={(e) => {
        setHover(true)
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setHover(false)
        props.onMouseLeave?.(e)
      }}
    >
      {items?.map((item) => (
        <div
          key={item.id}
          className={cls('ui-toast-item', {
            [`ui-toast-${item.type}`]: item.type
          })}
          ref={(el) => {
            itemRef.current[item.id] = el
            if (!el) {
              delete itemRef.current[item.id]
            }
          }}
        >
          {item.type && (
            <Icon className='ui-toast-icon'>
              {{
                info: 'info',
                success: 'check_circle',
                error: 'cancel',
                warning: 'error',
                loading: 'progress_activity'
              }[item.type]}
            </Icon>
          )}
          <div className='ui-toast-content'>
            <div className='ui-toast-title'>
              <span>{item.title}</span>
              <Icon className='ui-toast-icon' onClick={() => close(item.id)}>close</Icon>
            </div>
            <div className='ui-toast-description'>
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  ), document.body)
}

const useToast: Toast.useToast = (options) => {
  const ref = useRef<Toast.API>(null)

  const api = useMemo(() => ({
    open: (options: Toast.Options) => ref.current!.open(options),
    close: (id: number) => ref.current!.close(id),
    clear: () => ref.current!.clear()
  }), [])

  return [api, <Toast ref={ref} {...options} />]
}

export default useToast
