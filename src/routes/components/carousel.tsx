import Component from '../../common/Component'
import { Carousel } from '../../../lib/components'

const Title = 'Carousel'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'activeKey', type: 'any' },
      { prop: 'onChangeActiveKey', type: '(key: any) => any' }
    ]
  },
  {
    name: `${Title}.Item`,
    wraps: 'div',
    props: [
      { prop: 'key', type: 'any' }
    ]
  }
]
const Code = `
import { Carousel } from '@zenmi/ui'

export function Example() {
  const items = [
    { key: '1', item: 'Item 1' },
    { key: '2', item: 'Item 2' },
    { key: '3', item: 'Item 3' }
  ]

  return (
    <Carousel>
      {items.map((item) => (
        <Carousel.Item key={item.key}>{item.item}</Carousel.Item>
      ))}
    </Carousel>
  )
}
`
function Example() {
  const items = [
    { key: '1', item: 'Item 1' },
    { key: '2', item: 'Item 2' },
    { key: '3', item: 'Item 3' }
  ]

  return (
    <Carousel>
      {items.map((item) => (
        <Carousel.Item key={item.key}>{item.item}</Carousel.Item>
      ))}
    </Carousel>
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
