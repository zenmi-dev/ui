import Component from '../../common/Component'
import { Checkbox } from '../../../lib/components'

const Title = 'Checkbox'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/checkbox',
    props: [
      { prop: 'defaultValue', type: 'boolean' },
      { prop: 'value', type: 'boolean' },
      { prop: 'onChangeValue', type: '(value: boolean) => any' },
      { prop: 'indeterminate', type: 'boolean', defaultValue: false }
    ]
  },
  {
    name: `${Title}.Group`,
    wraps: 'input/hidden',
    props: [
      { prop: 'options', type: 'Checkbox.Option[]' },
      { prop: 'defaultValue', type: 'string[]' },
      { prop: 'value', type: 'string[]' },
      { prop: 'onChangeValue', type: '(value: string[]) => any' },
      { prop: 'children', type: '(option: Option) => React.ReactNode' }
    ]
  },
  {
    name: 'Checkbox.Option',
    props: [
      { prop: 'value', type: 'string' },
      { prop: 'label', type: 'string' },
      { prop: 'disabled', type: 'boolean', defaultValue: false }
    ]
  }
]
const Code1 = `
import { Checkbox } from '@zenmi/ui'

export function Example() {
  return (
    <Checkbox>checkbox</Checkbox>
  )
}
`
const Code2 = `
import { Checkbox } from '@zenmi/ui'

export function Example() {
  const options: Checkbox.Option[] = [
    { value: '1', label: 'checkbox 1' },
    { value: '2', label: 'checkbox 2' },
    { value: '3', label: 'checkbox 3' }
  ]

  return (
    <Checkbox.Group options={options} />
  )
}
`
function Example1() {
  return (
    <Checkbox>Checkbox</Checkbox>
  )
}
function Example2() {
  const options: Checkbox.Option[] = [
    { value: '1', label: 'Checkbox 1' },
    { value: '2', label: 'Checkbox 2' },
    { value: '3', label: 'Checkbox 3' }
  ]

  return (
    <Checkbox.Group options={options} />
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
