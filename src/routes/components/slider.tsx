import Component from '../../common/Component'
import { Slider } from '../../../lib/components'

const Title = 'Slider'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/range',
    props: [
      { prop: 'defaultValue', type: 'number' },
      { prop: 'value', type: 'number' },
      { prop: 'onChangeValue', type: '(value: number) => any' }
    ]
  }
]
const Code = `
import { Slider } from '@zenmi/ui'

export function Example() {
  return (
    <Slider defaultValue={50} />
  )
}
`
function Example() {
  return (
    <Slider defaultValue={50} />
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
