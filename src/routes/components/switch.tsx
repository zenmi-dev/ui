import Component from '../../common/Component'
import { Switch } from '../../../lib/components'

const Title = 'Switch'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/checkbox',
    props: [
      { prop: 'defaultValue', type: 'boolean' },
      { prop: 'value', type: 'boolean' },
      { prop: 'onChangeValue', type: '(value: boolean) => any' }
    ]
  }
]
const Code = `
import { Switch } from '@zenmi/ui'

export function Example() {
  return (
    <Switch />
  )
}
`
function Example() {
  return (
    <Switch />
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
