import Component from '../../common/Component'
import { Radio } from '../../../lib/components'

const Title = 'Radio'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/radio',
    props: [
      { prop: 'defaultValue', type: 'boolean' },
      { prop: 'value', type: 'boolean' },
      { prop: 'onChangeValue', type: '(value: boolean) => any' }
    ]
  },
  {
    name: `${Title}.Group`,
    wraps: 'input/hidden',
    props: [
      { prop: 'options', type: 'Radio.Option[]' },
      { prop: 'defaultValue', type: 'string' },
      { prop: 'value', type: 'string' },
      { prop: 'onChangeValue', type: '(value: string) => any' },
      { prop: 'children', type: '(option: Option) => React.ReactNode' }
    ]
  },
  {
    name: 'Radio.Option',
    props: [
      { prop: 'value', type: 'string' },
      { prop: 'label', type: 'string' },
      { prop: 'disabled', type: 'boolean', defaultValue: false }
    ]
  }
]
const Code1 = `
import { Radio } from '@zenmi/ui'

export function Example() {
  return (
    <Radio>radio</Radio>
  )
}
`
const Code2 = `
import { Radio } from '@zenmi/ui'

export function Example() {
  const options: Radio.Option[] = [
    { value: '1', label: 'radio 1' },
    { value: '2', label: 'radio 2' },
    { value: '3', label: 'radio 3' }
  ]

  return (
    <Radio.Group options={options} />
  )
}
`
function Example1() {
  return (
    <Radio>radio</Radio>
  )
}
function Example2() {
  const options: Radio.Option[] = [
    { value: '1', label: 'radio 1' },
    { value: '2', label: 'radio 2' },
    { value: '3', label: 'radio 3' }
  ]

  return (
    <Radio.Group options={options} />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { code: Code1, element: <Example1 />, center: true },
        { name: 'Group', code: Code2, element: <Example2 />, center: true }
      ]}
      apiItems={ApiItems}
    />
  )
}
