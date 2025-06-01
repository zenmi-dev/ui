import Component from '../../common/Component'
import { Icon } from '../../../lib/components'

const Title = 'Icon'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'span',
    props: [
      { prop: 'source', type: 'icon', defaultValue: 'Material Symbols Rounded' },
      { prop: 'size', type: 'number', defaultValue: 20 }
    ]
  }
]
const Code = `
import { Icon } from '@zenmi/ui'

export function Example() {
  return (
    <Icon>home</Icon>
  )
}
`
function Example() {
  return (
    <Icon>home</Icon>
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
