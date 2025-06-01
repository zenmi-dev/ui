import Component from '../../common/Component'
import { Button } from '../../../lib/components'

const Title = 'Button'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'button',
    props: []
  }
]
const Code = `
import { Button } from '@zenmi/ui'

export function Example() {
  return (
    <Button>Button</Button>
  )
}
`
function Example() {
  return (
    <Button>Button</Button>
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
