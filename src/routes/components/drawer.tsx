import Component from '../../common/Component'
import { Button, Drawer } from '../../../lib/components'
import { useState } from 'react'

const Title = 'Dialog'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'position', type: `'left' | 'right' | 'top' | 'bottom'`, defaultValue: 'right' },
      { prop: 'overlay', type: 'boolean', defaultValue: true },
      { prop: 'outsideClosable', type: 'boolean', defaultValue: true }
    ]
  },
  { name: `${Title}.Title`, wraps: 'div', props: [] },
  { name: `${Title}.Content`, wraps: 'div', props: [] },
  { name: `${Title}.Footer`, wraps: 'div', props: [] }
]
const Code = `
import { Button, Drawer } from '@zenmi/ui'

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer open={open} onChangeOpen={setOpen}>
        <Drawer.Title>Title</Drawer.Title>
        <Drawer.Content>Content</Drawer.Content>
        <Drawer.Footer>Footer</Drawer.Footer>
      </Drawer>
    </>
  )
}
`
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
      <Drawer open={open} onChangeOpen={setOpen}>
        <Drawer.Title>Title</Drawer.Title>
        <Drawer.Content>Content</Drawer.Content>
        <Drawer.Footer>Footer</Drawer.Footer>
      </Drawer>
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
