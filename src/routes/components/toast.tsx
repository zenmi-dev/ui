import Component from '../../common/Component'
import { Button, useToast } from '../../../lib/components'

const Title = 'Toast'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: `use${Title}`,
    description: (
      <pre>
        <ul>
          <li>{`
function useToast(options?: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}): [Toast.API, React.ReactNode]`.trim()}
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
          <li>{'open(options: Toast.Options): number'}</li>
          <li>{'close(id: number): void'}</li>
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
          <li>{'title?: React.ReactNode'}</li>
          <li>{'description?: React.ReactNode'}</li>
          <li>{'duration?: number'}</li>
        </ul>
      </pre>
    )
  }
]
const Code = `
import { Button, useToast } from '@zenmi/ui'

function Example() {
  const [toast, element] = useToast()

  return (
    <>
      {element}
      <Button
        onClick={() => {
          toast.open({ type: 'info', title: 'Toast', description: 'Description' })
        }}
      >
        Show Toast
      </Button>
    </>
  )
}
`
function Example() {
  const [toast, element] = useToast({ position: 'top-right' })

  return (
    <>
      {element}
      <Button
        onClick={() => {
          toast.open({ type: 'info', title: 'Toast', description: 'Description' })
        }}
      >
        Show Toast
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
