import Component from '../../common/Component'
import { Input } from '../../../lib/components'

const Title = 'Input'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/text',
    props: [
      { prop: 'defaultValue', type: 'string' },
      { prop: 'value', type: 'string' },
      { prop: 'onChangeValue', type: '(value: string) => any' },
      { prop: 'before', type: 'React.ReactNode' },
      { prop: 'after', type: 'React.ReactNode' }
    ]
  },
  {
    name: `${Title}.Password`,
    wraps: 'input/password',
    props: [
      { prop: 'defaultValue', type: 'string' },
      { prop: 'value', type: 'string' },
      { prop: 'onChangeValue', type: '(value: string) => any' },
      { prop: 'visibilityToggle', type: 'boolean', defaultValue: true },
      { prop: 'before', type: 'React.ReactNode' },
      { prop: 'after', type: 'React.ReactNode' },
    ]
  },
  {
    name: `${Title}.Number`,
    wraps: 'input/number',
    props: [
      { prop: 'defaultValue', type: 'number' },
      { prop: 'value', type: 'number' },
      { prop: 'onChangeValue', type: '(value: number) => any' },
      { prop: 'controls', type: 'boolean', defaultValue: true },
      { prop: 'before', type: 'React.ReactNode' },
      { prop: 'after', type: 'React.ReactNode' }
    ]
  }
]
const Code = `
import { Input } from '@zenmi/ui'

export function Example() {
  return (
    <Input />
  )
}
`
function Example1() {
  return (
    <Input />
  )
}
function Example2() {
  return (
    <Input.Password />
  )
}
function Example3() {
  return (
    <Input.Number />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        {
          name: 'Text',
          code: Code, 
          element: <Example1 />,
          center: true
        },
        {
          name: 'Password',
          code: Code.replace(/(<Input)/, '$1.Password'),
          element: <Example2 />,
          center: true
        },
        {
          name: 'Number',
          code: Code.replace(/(<Input)/, '$1.Number'),
          element: <Example3 />,
          center: true
        },
      ]}
      apiItems={ApiItems}
    />
  )
}
