import React, { use, useEffect, useMemo } from 'react'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'

declare namespace Tabs {
  type Props = React.JSX.IntrinsicElements['div'] & {
    activeKey?: any
    onChangeActiveKey?: (key: any) => any
  }
  type ListProps  = React.JSX.IntrinsicElements['div']
  type TriggerProps  = React.JSX.IntrinsicElements['div'] & {
    itemKey?: any
  }
  type ContentProps  = React.JSX.IntrinsicElements['div'] & {
    itemKey?: any
  }
}

const TabsContext = React.createContext<{
  activeKey: any
  setActiveKey: (v: any) => void
} | null>(null)

function Tabs(
  {
    activeKey: propsActiveKey,
    onChangeActiveKey,
    ...props
  }: Tabs.Props
) {
  const [activeKey, setActiveKey] = useStateListner(propsActiveKey, onChangeActiveKey)

  const [keys, Children] = useMemo(() => {
    const keys: any[] = []
    React.Children.forEach(props.children, (x: any) => {
      if (x?.type === TabsContent) {
        keys.push(x.key ?? keys.length)
      }
    })
    const k = [...keys]
    const Children = React.Children.map(props.children, (x: any) => {
      if (x?.type === TabsContent) {
        return React.cloneElement(x, { itemKey: k.shift(), ...x.props }, x.props.children)
      }
      return x
    })
    return [keys, Children]
  }, [props.children])

  useEffect(() => {
    if (keys[0] && keys.indexOf(propsActiveKey) === -1) {
      setActiveKey(keys[0])
    }
  }, [])

  return (
    <div
      {...props}
      className={cls('ui-tabs', props.className)}
    >
      <TabsContext.Provider value={{ activeKey, setActiveKey }}>
        {Children}
      </TabsContext.Provider>
    </div>
  )
}

function TabsList(props: Tabs.ListProps) {
  const {
    id, className, style, children, onClick,
    ...others
  } = props

  const Children = useMemo(() => {
    const keys: any[] = []
    React.Children.forEach(children, (x: any) => {
      if (x?.type === TabsTrigger) {
        keys.push(x.key ?? keys.length)
      }
    })
    const k = [...keys]
    const Children = React.Children.map(children, (x: any) => {
      if (x?.type === TabsTrigger) {
        return React.cloneElement(x, { itemKey: k.shift(), ...x.props }, x.props.children)
      }
      return x
    })
    return Children
  }, [children])

  return (
    <div
      id={id}
      className={cls('ui-tabs-list', className)}
      style={style}
      {...others}
    >
      {Children}
    </div>
  )
}

function TabsTrigger(props: Tabs.TriggerProps) {
  const {
    id, className, style, children, onClick,
    itemKey,
    ...others
  } = props

  const { activeKey, setActiveKey } = use(TabsContext)!

  return (
    <div
      id={id}
      className={cls('ui-tabs-trigger', {
        'ui-tabs-active': itemKey === activeKey
      }, className)}
      style={style}
      {...others}
      onClick={(e) => {
        setActiveKey(itemKey)
        onClick?.(e)
      }}
    >
      {children}
    </div>
  )
}

function TabsContent(props: Tabs.ContentProps) {
  const {
    id, className, style, children,
    itemKey,
    ...others
  } = props

  const { activeKey } = use(TabsContext)!

  return (
    <div
      id={id}
      className={cls('ui-tabs-content', {
        'ui-tabs-active': itemKey === activeKey
      }, className)}
      style={style}
      {...others}
    >
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export default Tabs
