import Component from '../../common/Component'
import { Select } from '../../../lib/components'

const Title = 'Select'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/hidden',
    props: [
      { prop: 'options', type: 'Select.Option[]' },
      { prop: 'defaultValue', type: 'string | string[]' },
      { prop: 'value', type: 'string | string[]' },
      { prop: 'onChangeValue', type: '(value: string | string[]) => any' },
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'multiple', type: 'boolean', defaultValue: false },
      { prop: 'optionsMaxHeight', type: 'number' },
      { prop: 'before', type: 'React.ReactNode' },
      { prop: 'after', type: 'React.ReactNode' },
      { prop: 'children', type: '(option: Option) => React.ReactNode' },
      { prop: 'tagRender', type: '(option: Option) => React.ReactNode' }
    ]
  },
  {
    name: 'Select.Option',
    props: [
      { prop: 'value', type: 'string' },
      { prop: 'label', type: 'string' },
      { prop: 'disabled', type: 'boolean', defaultValue: false }
    ]
  }
]
const Code = `
import { Select } from '@zenmi/ui'

export function Example() {
  const options: Select.Option[] = [
    { value: '1', label: 'option 1' },
    { value: '2', label: 'option 2' },
    { value: '3', label: 'option 3' }
  ]

  return (
    <Select options={options} />
  )
}
`
const options: Select.Option[] = [
  { value: '1', label: 'option 1' },
  { value: '2', label: 'option 2' },
  { value: '3', label: 'option 3' }
]
function Example1() {
  return (
    <Select options={options} />
  )
}
function Example2() {
  return (
    <Select options={options} multiple />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        {
          name: 'Single',
          code: Code,
          element: <Example1 />,
          center: true
        },
        {
          name: 'Multiple',
          code: Code.replace(/(\/>)/, 'multiple $1'),
          element: <Example2 />,
          center: true
        }
      ]}
      apiItems={ApiItems}
    />
  )
}
