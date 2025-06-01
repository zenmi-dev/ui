import Component from '../../common/Component'
import { Button, Popover } from '../../../lib/components'

const Title = 'Popover'
const TypePosition = `
'top' | 'top-left' | 'top-right' |
'bottom' | 'bottom-left' | 'bottom-right' |
'left' | 'left-top' | 'left-bottom' |
'right' | 'right-top' | 'right-bottom'
`
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'trigger', type: `'hover' | 'click' | 'focus'`, defaultValue: 'hover' },
      { prop: 'position', type: TypePosition, defaultValue: 'top' },
      { prop: 'offset', type: 'number', defaultValue: 4 },
    ]
  }
]
const Code = `
import { Button, Popover } from '@zenmi/ui'

export function Example() {
  return (
    <Button>
      Hover me
      <Popover>Popover</Popover>
    </Button>
  )
}
`
function Example() {
  return (
    <Button>
      Hover me
      <Popover>Popover</Popover>
    </Button>
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
