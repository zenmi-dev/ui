import React, { use, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useClickOutside, useFirstRender } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'
import Overlay from '../Overlay'
import Icon from '../Icon'

declare namespace Dialog {
  type Props = React.JSX.IntrinsicElements['div'] & {
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    overlay?: boolean
    outsideClosable?: boolean
  }
  type TitleProps = React.JSX.IntrinsicElements['div']
  type ContentProps = React.JSX.IntrinsicElements['div']
  type FooterProps = React.JSX.IntrinsicElements['div']
}

const DialogContext = React.createContext<{
  setOpen: (open: boolean) => void
} | null>(null)

function Dialog(
  {
    open: propsOpen,
    onChangeOpen,
    overlay = true,
    outsideClosable = true,
    ...props
  }: Dialog.Props
) {
  const firstRender = useFirstRender()
  const [el, ref] = useComponentRef(props.ref)
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const [close, setClose] = useState(!open)

  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.remove('ui-dialog-close')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.add('ui-dialog-close')
      el.current.addEventListener('animationend', listener)
      return () => el.current?.removeEventListener('animationend', listener)
    }
  }, [open])

  useClickOutside(el, () => {
    if (outsideClosable) {
      setOpen(false)
    }
  })

  return (
    <>
      {overlay && <Overlay open={open} />}
      {!firstRender && !close && createPortal((
        <div
          {...props}
          className={cls('ui-dialog', props.className)}
          ref={ref}
        >
          <DialogContext.Provider value={{ setOpen }}>
            {props.children}
          </DialogContext.Provider>
        </div>
      ), document.body)}
    </>
  )
}

function DialogTitle(props: Dialog.TitleProps) {
  const { setOpen } = use(DialogContext)!

  return (
    <div
      {...props}
      className={cls('ui-dialog-title', props.className)}
    >
      <span>{props.children}</span>
      <Icon className='ui-dialog-icon' onClick={() => setOpen(false)}>close</Icon>
    </div>
  )
}

function DialogContent(props: Dialog.ContentProps) {
  return (
    <div
      {...props}
      className={cls('ui-dialog-content', props.className)}
    >
      {props.children}
    </div>
  )
}

function DialogFooter(props: Dialog.FooterProps) {
  return (
    <div
      {...props}
      className={cls('ui-drawer-footer', props.className)}
    >
      {props.children}
    </div>
  )
}

Dialog.Title = DialogTitle
Dialog.Content = DialogContent
Dialog.Footer = DialogFooter

export default Dialog
