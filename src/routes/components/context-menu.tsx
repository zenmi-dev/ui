import Component from '../../common/Component'
import { ContextMenu } from '../../../lib/components'

const Title = 'ContextMenu'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
    ]
  }
]
const Code = `
import { ContextMenu } from '@zenmi/ui'

export function Example() {
  const style: React.CSSProperties = {
    height: 200,
    width: '100%',
    border: '1px dashed gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div style={style}>
      Right click me
      <ContextMenu>Content</ContextMenu>
    </div>
  )
}
`
function Example() {
  const style: React.CSSProperties = {
    height: 200,
    border: '1px solid lightgray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div style={style}>
      Right click me
      <ContextMenu>Content</ContextMenu>
    </div>
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { code: Code, element: <Example /> }
      ]}
      apiItems={ApiItems}
    />
  )
}
