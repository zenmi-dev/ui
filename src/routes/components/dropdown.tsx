import Component from '../../common/Component'
import { Dropdown } from '../../../lib/components'

const Title = 'Dropdown'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'trigger', type: `'hover' | 'click'`, defaultValue: 'hover' },
      { prop: 'position', type: `'left' | 'center' | 'right'`, defaultValue: 'left' },
      { prop: 'offset', type: 'number', defaultValue: 4 },
    ]
  },
  { name: `${Title}.Trigger`, wraps: 'div', props: [] },
  { name: `${Title}.Content`, wraps: 'div', props: [] }
]
const Code = `
import { Dropdown } from '@zenmi/ui'

export function Example() {
  return (
    <Dropdown>
      <Dropdown.Trigger>Hover me</Dropdown.Trigger>
      <Dropdown.Content>Content</Dropdown.Content>
    </Dropdown>
  )
}
`
function Example() {
  return (
    <Dropdown>
      <Dropdown.Trigger>Hover me</Dropdown.Trigger>
      <Dropdown.Content>Content</Dropdown.Content>
    </Dropdown>
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { code: Code, element: <Example />, center: true }
      ]}
      apiItems={ApiItems}
    />
  )
}
