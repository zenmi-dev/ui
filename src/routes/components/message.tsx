import Component from '../../common/Component'
import { Button, useMessage } from '../../../lib/components'

const Title = 'Message'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: `use${Title}`,
    description: (
      <pre>
        <ul>
          <li>{`
function useMessage(options?: {
  position?: 'top' | 'bottom'
}): [Message.API, React.ReactNode]`.trim()}
          </li>
        </ul>
      </pre>
    )
  },
  {
    name: `${Title}.API`,
    description: (
      <pre>
        <ul>
          <li>{'open(options: Message.Options): void'}</li>
          <li>{'close(): void'}</li>
        </ul>
      </pre>
    )
  },
  {
    name: `${Title}.Options`,
    description: (
      <pre>
        <ul>
          <li>{`type?: 'info' | 'success' | 'error' | 'warning' | 'loading'`}</li>
          <li>{'content?: React.ReactNode'}</li>
          <li>{'duration?: number'}</li>
        </ul>
      </pre>
    )
  }
]
const Code = `
import { Button, useMessage } from '@zenmi/ui'

export function Example() {
  const [message, element] = useMessage()

  return (
    <>
      {element}
      <Button onClick={() => message.open({ type: 'info', content: 'Message' })}>
        Show Message
      </Button>
    </>
  )
}
`
function Example() {
  const [message, element] = useMessage()

  return (
    <>
      {element}
      <Button onClick={() => message.open({ type: 'info', content: 'Message' })}>
        Show Message
      </Button>
    </>
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
