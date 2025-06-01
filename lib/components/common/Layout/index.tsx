import React from 'react'
import { cls } from '../../../utils/index.js'

declare namespace Layout {
  type Props = React.JSX.IntrinsicElements['div']
  type HeaderProps = React.JSX.IntrinsicElements['header']
  type MainProps = React.JSX.IntrinsicElements['main']
  type FooterProps = React.JSX.IntrinsicElements['header']
  type SiderProps = React.JSX.IntrinsicElements['div']
}

function Layout(props: Layout.Props) {
  return (
    <div
      {...props}
      className={cls('ui-layout', {
        'ui-layout-has-sider': React.Children.toArray(props.children).find((x: any) => x?.type === LayoutSider)
      }, props.className)}
    >
      {props.children}
    </div>
  )
}

function LayoutHeader(props: Layout.HeaderProps) {
  return (
    <header
      {...props}
      className={cls('ui-layout-header', props.className)}
    >
      {props.children}
    </header>
  )
}

function LayoutMain(props: Layout.MainProps) {
  return (
    <main
      {...props}
      className={cls('ui-layout-main', props.className)}
    >
      {props.children}
    </main>
  )
}

function LayoutFooter(props: Layout.FooterProps) {
  return (
    <footer
      {...props}
      className={cls('ui-layout-footer', props.className)}
    >
      {props.children}
    </footer>
  )
}

function LayoutSider(props: Layout.SiderProps) {
  return (
    <div
      {...props}
      className={cls('ui-layout-sider', props.className)}
    >
      {props.children}
    </div>
  )
}

Layout.Header = LayoutHeader
Layout.Main = LayoutMain
Layout.Footer = LayoutFooter
Layout.Sider = LayoutSider

export default Layout
