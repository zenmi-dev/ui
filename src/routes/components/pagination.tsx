import Component from '../../common/Component'
import { Pagination } from '../../../lib/components'

const Title = 'Pagination'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'total', type: 'number', defaultValue: 10 },
      { prop: 'page', type: 'number' },
      { prop: 'onChangePage', type: '(page: number) => any' }
    ]
  }
]
const Code = `
import { Pagination } from '@zenmi/ui'

export function Example() {
  return (
    <Pagination />
  )
}
`
function Example() {
  return (
    <Pagination />
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
