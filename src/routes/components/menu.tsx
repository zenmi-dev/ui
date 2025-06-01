import Component from '../../common/Component'
import { Menu } from '../../../lib/components'

const Title = 'Menu'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'menus', type: 'Menu.Item[]' },
      { prop: 'openKeys', type: 'any[]' },
      { prop: 'onChangeOpenKeys', type: '(keys: any[]) => any' },
      { prop: 'activeKey', type: 'any' },
      { prop: 'onChangeActiveKey', type: '(key: any) => any' },
      { prop: 'type', type: `'vertical' | 'horizontal'`, defaultValue: 'vertical' },
      { prop: 'childrenType', type: `'dropdown' | 'popover'`, defaultValue: 'dropdown' },
      { prop: 'indent', type: 'number', defaultValue: 16 },
    ]
  },
  {
    name: 'Menu.Item',
    description: (
      <code>
        <ul>
          <li>key: any</li>
          <li>name: React.ReactNode</li>
          <li>children?: Menu.Item[]</li>
          <li>disabled?: boolean</li>
        </ul>
      </code>
    )
  }
]
const Code = `
import { Menu } from '@zenmi/ui'

export function Example() {
  const style: React.CSSProperties = {
    border: '1px solid lightgray'
  }
  const menus: Menu.Item[] = [
    { key: '1', name: 'Item 1' },
    { key: '2', name: 'Item 2' },
    {
      key: '3',
      name: 'Group 3',
      children: [
        { key: '3-1', name: 'Item 3-1' },
        { key: '3-2', name: 'Item 3-2' },
        { key: '3-3', name: 'Item 3-3' },
      ]
    },
  ]

  return (
    <Menu menus={menus} />
  )
}
`
const style: React.CSSProperties = {
  border: '1px solid lightgray'
}
const menus: Menu.Item[] = [
  { key: '1', name: 'Item 1' },
  { key: '2', name: 'Item 2' },
  {
    key: '3',
    name: 'Group 3',
    children: [
      { key: '3-1', name: 'Item 3-1' },
      { key: '3-2', name: 'Item 3-2' },
      { key: '3-3', name: 'Item 3-3' },
    ]
  },
]
function Example1() {
  return (
    <Menu style={style} menus={menus} />
  )
}
function Example2() {
  return (
    <Menu style={style} menus={menus} type='horizontal' />
  )
}
function Example3() {
  return (
    <Menu style={style} menus={menus} childrenType='popover' />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        {
          name: 'Vertical',
          code: Code,
          element: <Example1 />,
          center: true
        },
        {
          name: 'Horizontal',
          code: Code.replace(/(\/>)/, 'type=\'horizontal\' $1'),
          element: <Example2 />
        },
        {
          name: 'Popover',
          code: Code.replace(/(\/>)/, 'childrenType=\'popover\' $1'),
          element: <Example3 />,
          center: true
        }
      ]}
      apiItems={ApiItems}
    />
  )
}
