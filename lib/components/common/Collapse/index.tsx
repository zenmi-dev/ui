import React, { use, useMemo } from 'react'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'
import Icon from '../Icon'

declare namespace Collapse {
  type Props = React.JSX.IntrinsicElements['div'] & {
    openKeys?: any[]
    onChangeOpenKeys?: (keys: any[]) => any
  }
  type ItemProps = React.JSX.IntrinsicElements['div'] & {
    itemKey?: any
  }
  type TriggerProps = React.JSX.IntrinsicElements['div']
  type ContentProps = React.JSX.IntrinsicElements['div']
}

const CollapseContext = React.createContext<{
  openKeys: any[]
  changeOpenKeys: (key: any, v: boolean) => void
} | null>(null)
const ItemContext = React.createContext<{
  itemKey: any
} | null>(null)

function Collapse(
  {
    openKeys: propsOpenKeys,
    onChangeOpenKeys,
    ...props
  }: Collapse.Props
) {
  const [openKeys, setOpenKeys] = useStateListner(propsOpenKeys as any[], onChangeOpenKeys, [])

  const Children = useMemo(() => {
    const keys: any[] = []
    React.Children.forEach(props.children, (x: any) => {
      if (x?.type === CollapseItem) {
        keys.push(x.key ?? keys.length)
      }
    })
    const k = [...keys]
    const Children = React.Children.map(props.children, (x: any) => {
      if (x?.type === CollapseItem) {
        return React.cloneElement(x, { itemKey: k.shift(), ...x.props }, x.props.children)
      }
      return x
    })
    return Children
  }, [props.children])

  const changeOpenKeys = (key: any, v: boolean) => {
    if (v) {
      if (!openKeys.includes(key)) {
        setOpenKeys([...openKeys, key])
      }
    } else {
      if (openKeys.includes(key)) {
        setOpenKeys(openKeys.filter((x) => x !== key))
      }
    }
  }

  return (
    <div
      {...props}
      className={cls('ui-collapse', props.className)}
    >
      <CollapseContext.Provider value={{ openKeys, changeOpenKeys }}>
        {Children}
      </CollapseContext.Provider>
    </div>
  )
}

function CollapseItem(
  {
    itemKey,
    ...props
  }: Collapse.ItemProps
) {
  const { openKeys } = use(CollapseContext)!

  return (
    <div
      {...props}
      className={cls('ui-collapse-item', {
        'ui-collapse-open': openKeys.includes(itemKey)
      }, props.className)}
    >
      <ItemContext.Provider value={{ itemKey }}>
        {props.children}
      </ItemContext.Provider>
    </div>
  )
}

function CollapseTrigger(props: Collapse.TriggerProps) {
  const { openKeys, changeOpenKeys } = use(CollapseContext)!
  const { itemKey } = use(ItemContext)!

  return (
    <div
      {...props}
      className={cls('ui-collapse-trigger', props.className)}
      onClick={(e) => {
        changeOpenKeys(itemKey, !openKeys.includes(itemKey))
        props.onClick?.(e)
      }}
    >
      <span>{props.children}</span>
      <Icon className='ui-collapse-icon'>keyboard_arrow_down</Icon>
    </div>
  )
}

function CollapseContent(props: Collapse.ContentProps) {
  return (
    <div
      {...props}
      className={cls('ui-collapse-content', props.className)}
    >
      <div>{props.children}</div>
    </div>
  )
}

Collapse.Item = CollapseItem
Collapse.Trigger = CollapseTrigger
Collapse.Content = CollapseContent

export default Collapse
