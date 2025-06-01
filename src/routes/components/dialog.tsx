import Component from '../../common/Component'
import { Button, Dialog } from '../../../lib/components'
import { useState } from 'react'

const Title = 'Dialog'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'overlay', type: 'boolean', defaultValue: true },
      { prop: 'outsideClosable', type: 'boolean', defaultValue: true }
    ]
  },
  { name: `${Title}.Title`, wraps: 'div', props: [] },
  { name: `${Title}.Content`, wraps: 'div', props: [] },
  { name: `${Title}.Footer`, wraps: 'div', props: [] }
]
const Code = `
import { Button, Dialog } from '@zenmi/ui'

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onChangeOpen={setOpen}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Content>Content</Dialog.Content>
        <Dialog.Footer>Footer</Dialog.Footer>
      </Dialog>
    </>
  )
}
`
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog open={open} onChangeOpen={setOpen}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Content>Content</Dialog.Content>
        <Dialog.Footer>Footer</Dialog.Footer>
      </Dialog>
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
