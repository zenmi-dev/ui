import Component from '../../common/Component'
import { Divider } from '../../../lib/components'

const Title = 'Divider'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'type', type: `'horizontal' | 'vertical'`, defaultValue: 'horizontal' }
    ]
  }
]
const Code1 = `
import { Divider } from '@zenmi/ui'

export function Example() {
  return (
    <>
      <div>Title</div>
      <Divider />
      <div>Content</div>
    </>
  )
}
`
const Code2 = `
import { Divider } from '@zenmi/ui'

export function Example() {
  const style: React.CSSProperties = {
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }

  return (
    <div style={style}>
      <div>Item 1</div>
      <Divider type='vertical' />
      <div>Item 2</div>
    </div>
  )
}
`
function Example1() {
  return (
    <>
      <div>Title</div>
      <Divider />
      <div>Content</div>
    </>
  )
}
function Example2() {
  const style: React.CSSProperties = {
    height: 40,
    display: 'flex',
    alignItems: 'center'
  }

  return (
    <div style={style}>
      <div>Item 1</div>
      <Divider type='vertical' />
      <div>Item 2</div>
    </div>
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { name: 'Horizontal', code: Code1, element: <Example1 />},
        { name: 'Vertical', code: Code2, element: <Example2 />, center: true}
      ]}
      apiItems={ApiItems}
    />
  )
}
