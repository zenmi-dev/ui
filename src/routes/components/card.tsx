import Component from '../../common/Component'
import { Card } from '../../../lib/components'

const Title = 'Card'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: []
  }
]
const Code = `
import { Card } from '@zenmi/ui'

export function Example() {
  return (
    <Card>Content</Card>
  )
}
`
function Example() {
  return (
    <Card>Content</Card>
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
