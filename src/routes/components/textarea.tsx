import Component from '../../common/Component'
import { Textarea } from '../../../lib/components'

const Title = 'Textarea'
const TypeAutoRows = `
boolean | {
  min?: number
  max?: number
}`
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'textarea',
    props: [
      { prop: 'defaultValue', type: 'string' },
      { prop: 'value', type: 'string' },
      { prop: 'onChangeValue', type: '(value: string) => any' },
      { prop: 'autoRows', type: TypeAutoRows, defaultValue: false }
    ]
  }
]
const Code = `
import { Textarea } from '@zenmi/ui'

export function Example() {
  return (
    <Textarea />
  )
}
`
function Example1() {
  return (
    <Textarea />
  )
}
function Example2() {
  return (
    <Textarea autoRows />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        {
          code: Code,
          element: <Example1 />,
          center: true
        },
        {
          name: 'Auto Rows',
          code: Code.replace(/(\/>)/, 'autoRows $1'),
          element: <Example2 />,
          center: true
        }
      ]}
      apiItems={ApiItems}
    />
  )
}
