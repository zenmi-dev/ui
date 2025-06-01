import Component from '../../common/Component'
import { Tabs } from '../../../lib/components'

const Title = 'Tabs'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'activeKey', type: 'any' },
      { prop: 'onChangeActiveKey', type: '(key: any) => any' }
    ]
  },
  { name: `${Title}.List`, wraps: 'div', props: [] },
  { name: `${Title}.Trigger`, wraps: 'div', props: [] },
  { name: `${Title}.Content`, wraps: 'div', props: [] }
]
const Code = `
import { Tabs } from '@zenmi/ui'

export function Example() {
  const items = [
    { key: '1', trigger: 'Tab 1', content: 'Content 1' },
    { key: '2', trigger: 'Tab 2', content: 'Content 2' },
    { key: '3', trigger: 'Tab 3', content: 'Content 3' }
  ]

  return (
    <Tabs>
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger key={item.key}>{item.trigger}</Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.key}>{item.content}</Tabs.Content>
      ))}
    </Tabs>
  )
}
`
function Example() {
  const items = [
    { key: '1', trigger: 'Tab 1', content: 'Content 1' },
    { key: '2', trigger: 'Tab 2', content: 'Content 2' },
    { key: '3', trigger: 'Tab 3', content: 'Content 3' }
  ]

  return (
    <Tabs>
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger key={item.key}>{item.trigger}</Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.key}>{item.content}</Tabs.Content>
      ))}
    </Tabs>
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
