import Component from '../../common/Component'
import { Collapse } from '../../../lib/components'

const Title = 'Collapse'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'openKeys', type: 'any[]' },
      { prop: 'onChangeOpenKeys', type: '(keys: any[]) => any' }
    ]
  },
  {
    name: `${Title}.Item`,
    wraps: 'div',
    props: [
      { prop: 'key', type: 'any' }
    ]
  },
  { name: `${Title}.Trigger`, wraps: 'div', props: [] },
  { name: `${Title}.Content`, wraps: 'div', props: [] }
]
const Code = `
import { Collapse } from '@zenmi/ui'

export function Example() {
  const items = [
    { key: '1', trigger: 'Trigger 1', content: 'Content 1' },
    { key: '2', trigger: 'Trigger 2', content: 'Content 2' },
    { key: '3', trigger: 'Trigger 3', content: 'Content 3' }
  ]

  return (
    <Collapse>
      {items.map((item) => (
        <Collapse.Item key={item.key}>
          <Collapse.Trigger>{item.trigger}</Collapse.Trigger>
          <Collapse.Content>{item.content}</Collapse.Content>
        </Collapse.Item>
      ))}
    </Collapse>
  )
}
`
function Example() {
  const items = [
    { key: '1', trigger: 'Trigger 1', content: 'Content 1' },
    { key: '2', trigger: 'Trigger 2', content: 'Content 2' },
    { key: '3', trigger: 'Trigger 3', content: 'Content 3' }
  ]

  return (
    <Collapse>
      {items.map((item) => (
        <Collapse.Item key={item.key}>
          <Collapse.Trigger>{item.trigger}</Collapse.Trigger>
          <Collapse.Content>{item.content}</Collapse.Content>
        </Collapse.Item>
      ))}
    </Collapse>
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { code: Code, element: <Example /> }
      ]}
      apiItems={ApiItems}
    />
  )
}
