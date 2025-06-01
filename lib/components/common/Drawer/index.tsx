import React, { use, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cls } from '../../../utils/index.js'
import { useClickOutside, useFirstRender } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'
import Overlay from '../Overlay'
import Icon from '../Icon'

declare namespace Drawer {
  type Props = React.JSX.IntrinsicElements['div'] & {
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    position?: 'left' | 'right' | 'top' | 'bottom'
    overlay?: boolean
    outsideClosable?: boolean
  }
  type TitleProps  = React.JSX.IntrinsicElements['div']
  type ContentProps  = React.JSX.IntrinsicElements['div']
  type FooterProps  = React.JSX.IntrinsicElements['div']
}

const DrawerContext = React.createContext<{
  setOpen: (open: boolean) => void
} | null>(null)

function Drawer(
  {
    open: propsOpen,
    onChangeOpen,
    position = 'right',
    overlay = true,
    outsideClosable = true,
    ...props
  }: Drawer.Props
) {
  const firstRender = useFirstRender()
  const [el, ref] = useComponentRef(props.ref)
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const [close, setClose] = useState(!open)

  useEffect(() => {
    if (open) {
      if (el.current) {
        el.current.classList.remove('ui-drawer-close')
      }
      setClose(false)
    } else if (el.current) {
      const listener = () => setClose(true)
      el.current.classList.add('ui-drawer-close')
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
          className={cls('ui-drawer', {
            [`ui-drawer-${position}`]: position
          }, props.className)}
          ref={ref}
        >
          <DrawerContext.Provider value={{ setOpen }}>
            {props.children}
          </DrawerContext.Provider>
        </div>
      ), document.body)}
    </>
  )
}

function DrawerTitle(props: Drawer.TitleProps) {
  const { setOpen } = use(DrawerContext)!

  return (
    <div
      {...props}
      className={cls('ui-drawer-title', props.className)}
    >
      <Icon className='ui-drawer-icon' onClick={() => setOpen(false)}>close</Icon>
      <span>{props.children}</span>
    </div>
  )
}

function DrawerContent(props: Drawer.ContentProps) {
  return (
    <div
      {...props}
      className={cls('ui-drawer-content', props.className)}
    >
      {props.children}
    </div>
  )
}

function DrawerFooter(props: Drawer.FooterProps) {
  return (
    <div
      {...props}
      className={cls('ui-drawer-footer', props.className)}
    >
      {props.children}
    </div>
  )
}

Drawer.Title = DrawerTitle
Drawer.Content = DrawerContent
Drawer.Footer = DrawerFooter

export default Drawer
