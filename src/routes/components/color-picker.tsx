import Component from '../../common/Component'
import { ColorPicker } from '../../../lib/components'

const Title = 'ColorPicker'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input',
    props: [
      { prop: 'defaultValue', type: 'string' },
      { prop: 'value', type: 'string' },
      { prop: 'onChangeValue', type: '(value: string) => any' }
    ]
  }
]
const Code = `
import { ColorPicker } from '@zenmi/ui'

export function Example() {
  return (
    <ColorPicker />
  )
}
`
function Example() {
  return (
    <ColorPicker />
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
