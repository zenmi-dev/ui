import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useFirstRender } from '../../../hooks/index.js'
import Icon from '../Icon'

export declare namespace Message {
  type Props = Omit<React.JSX.IntrinsicElements['div'], 'ref'> & {
    ref?: React.Ref<API>
    position?: Position
  }
  type Position = 'top' | 'bottom'
  type API = {
    open: (options: Options) => void
    close: () => void
  }
  type Options = {
    type?: 'info' | 'success' | 'error' | 'warning' | 'loading'
    content?: React.ReactNode
    duration?: number
  }
  interface useMessage {
    (options?: {
      position?: Position
    }): [API, React.ReactNode]
  }
}

function Message(
  {
    ref,
    position = 'top',
    ...props
  }: Message.Props
) {
  const firstRender = useFirstRender()
  const el = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState<Message.Options | null>(null)
  const [update, setUpdate] = useState(0)
  const timer = useRef(0)

  const open = (options: Message.Options) => {
    window.clearTimeout(timer.current)
    if (el.current) {
      el.current.classList.remove('ui-message-close')
    }
    setMessage(options)
    setUpdate((prev) => prev + 1)
    const { duration = 3000 } = options
    if (duration) {
      timer.current = window.setTimeout(close, duration)
    }
  }
  const close = () => {
    if (el.current && !el.current.classList.contains('ui-message-close')) {
      const listener = () => setMessage(null)
      el.current.classList.add('ui-message-close')
      el.current.addEventListener('animationend', listener)
    }
  }

  useImperativeHandle(ref, () => ({ open, close }))

  return !firstRender && message && createPortal((
    <div
      {...props}
      className={cls('ui-message', {
        [`ui-message-${position}`]: position,
        [`ui-message-${message.type}`]: message.type
      }, props.className)}
      ref={el}
      key={update}
    >
      {message.type && (
        <Icon className='ui-message-icon'>
          {{
            info: 'info',
            success: 'check_circle',
            error: 'cancel',
            warning: 'error',
            loading: 'progress_activity'
          }[message.type]}
        </Icon>
      )}
      <span>{message.content}</span>
    </div>
  ), document.body)
}

const useMessage: Message.useMessage = (options) => {
  const ref = useRef<Message.API>(null)

  const api = useMemo(() => ({
    open: (options: Message.Options) => ref.current!.open(options),
    close: () => ref.current!.close()
  }), [])

  return [api, <Message ref={ref} {...options} />]
}

export default useMessage
