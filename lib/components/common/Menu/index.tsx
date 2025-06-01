import React, { use, useRef } from 'react'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'
import Icon from '../Icon'
import Dropdown from '../Dropdown'
import Popover from '../Popover'

declare namespace Menu {
  type Props = React.JSX.IntrinsicElements['div'] & {
    menus?: Item[]
    openKeys?: any[]
    onChangeOpenKeys?: (keys: any[]) => any
    activeKey?: any
    onChangeActiveKey?: (key: any) => any
    type?: 'vertical' | 'horizontal'
    childrenType?: 'dropdown' | 'popover'
    indent?: number
  }
  type VerticalProps = {
    menus?: Item[]
    indent: number
  }
  type HorizontalProps = {
    menus?: Item[]
  }
  type Item = {
    key: any
    name: React.ReactNode
    children?: Item[]
    disabled?: boolean
  }
}

const MenuContext = React.createContext<{
  openKeys: any[]
  activeKey: any
  setActiveKey: (key: any) => void
  childrenType: 'dropdown' | 'popover'
  indent: number
  changeOpenKeys: (key: any, v: boolean) => void
  onClickGroupChildren: (e: React.MouseEvent, key: any) => void
} | null>(null)

function Menu(
  {
    menus,
    openKeys: propsOpenKeys,
    onChangeOpenKeys,
    activeKey: propsActiveKey,
    onChangeActiveKey,
    type = 'vertical',
    childrenType = 'dropdown',
    indent = 16,
    ...props
  }: Menu.Props
) {
  const [openKeys, setOpenKeys] = useStateListner(propsOpenKeys as any[], onChangeOpenKeys, [])
  const [activeKey, setActiveKey] = useStateListner(propsActiveKey as any, onChangeActiveKey)
  const closeKeys = useRef<any[]>([])
  const timer = useRef(0)

  const changeOpenKeys = (key: any, v: boolean) => {
    if (v) {
      if (!openKeys.includes(key)) {
        setOpenKeys([...openKeys, key])
      }
    } else {
      if (!closeKeys.current.includes(key)) {
        closeKeys.current.push(key)
      }
      if (openKeys.find((x) => closeKeys.current.includes(x))) {
        setOpenKeys(openKeys.filter((x) => !closeKeys.current.includes(x)))
      }
    }
  }
  const onClickGroupChildren = (e: React.MouseEvent, key: any) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('ui-menu-item')) {
      if (!closeKeys.current.includes(key)) {
        closeKeys.current.push(key)
      }
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        changeOpenKeys(key, false)
        closeKeys.current = []
      }, 100)
    }
  }

  return (
    <div
      {...props}
      className={cls('ui-menu', {
        [`ui-menu-${type}`]: type
      }, props.className)}
    >
      <MenuContext.Provider
        value={{
          openKeys,
          activeKey,
          setActiveKey,
          childrenType,
          indent,
          changeOpenKeys,
          onClickGroupChildren
        }}
      >
        {type === 'vertical' ? (
          <MenuVertical menus={menus} indent={indent} />
        ) : (
          <MenuHorizontal menus={menus} />
        )}
      </MenuContext.Provider>
    </div>
  )
}

function MenuVertical(
  {
    menus,
    indent: propsIndent
  }: Menu.VerticalProps
) {
  const { openKeys, activeKey, setActiveKey, indent, childrenType, changeOpenKeys, onClickGroupChildren } = use(MenuContext)!

  return (
    <>
      {menus?.map((item) => item.children?.length ? (
        <div
          key={item.key}
          className={cls('ui-menu-group', {
            'ui-menu-open': openKeys.includes(item.key),
            'ui-menu-popover': childrenType === 'popover',
            'ui-disabled': item.disabled
          })}
        >
          <div
            className='ui-menu-group-title'
            style={{ paddingLeft: propsIndent }}
            onClick={() => {
              if (childrenType !== 'popover') {
                changeOpenKeys(item.key, !openKeys.includes(item.key))
              }
            }}
          >
            <span>{item.name}</span>
            <Icon className='ui-menu-icon'>
              {childrenType !== 'popover' ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </Icon>
          </div>
          {childrenType !== 'popover' ? (
            <div className='ui-menu-group-children'>
              <div>
                <MenuVertical menus={item.children} indent={propsIndent + indent} />
              </div>
            </div>
          ) : (
            <Popover
              className='ui-menu-vertical'
              open={openKeys.includes(item.key)}
              onChangeOpen={(v) => changeOpenKeys(item.key, v)}
              onClick={(e) => onClickGroupChildren(e, item.key)}
              position='right-top'
            >
              <MenuVertical menus={item.children} indent={indent} />
            </Popover>
          )}
        </div>
      ) : (
        <div
          key={item.key}
          className={cls('ui-menu-item', {
            'ui-menu-active': item.key === activeKey,
            'ui-disabled': item.disabled
          })}
          style={{ paddingLeft: propsIndent }}
          onClick={() => setActiveKey(item.key)}
        >
          {item.name}
        </div>
      ))}
    </>
  )
}

function MenuHorizontal(
  {
    menus
  }: Menu.HorizontalProps
) {
  const { openKeys, activeKey, setActiveKey, indent, changeOpenKeys, onClickGroupChildren } = use(MenuContext)!

  return (
    <>
      {menus?.map((item) => item.children?.length ? (
        <Dropdown
          key={item.key}
          className={cls('ui-menu-group', {
            'ui-menu-open': openKeys.includes(item.key),
            'ui-disabled': item.disabled
          })}
          open={openKeys.includes(item.key)}
          onChangeOpen={(v) => changeOpenKeys(item.key, v)}
        >
          <Dropdown.Trigger className='ui-menu-group-title'>
            {item.name}
          </Dropdown.Trigger>
          <Dropdown.Content
            className='ui-menu-vertical'
            onClick={(e) => onClickGroupChildren(e, item.key)}
          >
            <MenuVertical menus={item.children} indent={indent} />
          </Dropdown.Content>
        </Dropdown>
      ) : (
        <div
          key={item.key}
          className={cls('ui-menu-item', {
            'ui-menu-active': item.key === activeKey,
            'ui-disabled': item.disabled
          })}
          onClick={() => setActiveKey(item.key)}
        >
          {item.name}
        </div>
      ))}
    </>
  )
}

export default Menu
