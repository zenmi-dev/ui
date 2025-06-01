import Component from '../../common/Component'
import { Table } from '../../../lib/components'

const Title = 'Table'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: []
  }
]
const Code = `
import { Popover } from '@zenmi/ui'

export function Example() {
  const cols = [
    { key: 'key1', name: 'col 1' },
    { key: 'key2', name: 'col 2' },
    { key: 'key3', name: 'col 3' }
  ]
  const data: {
    id: any
    [k: string]: any
  }[] = [
    { id: 0, key1: 'data 1-1', key2: 'data 1-2', key3: 'data 1-3' },
    { id: 1, key1: 'data 2-2', key2: 'data 2-2', key3: 'data 2-3' },
    { id: 2, key1: 'data 2-2', key2: 'data 2-2', key3: 'data 2-3' }
  ]

  return (
    <Table>
      <thead>
        <tr>
          {cols.map((col) => (
            <th key={col.key}>{col.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {cols.map((col) => (
              <td key={col.key}>{item[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} align='center'>footer</td>
        </tr>
      </tfoot>
    </Table>
  )
}
`
function Example() {
  const cols = [
    { key: 'key1', name: 'col 1' },
    { key: 'key2', name: 'col 2' },
    { key: 'key3', name: 'col 3' }
  ]
  const data: {
    id: any
    [k: string]: any
  }[] = [
    { id: 0, key1: 'data 1-1', key2: 'data 1-2', key3: 'data 1-3' },
    { id: 1, key1: 'data 2-2', key2: 'data 2-2', key3: 'data 2-3' },
    { id: 2, key1: 'data 2-2', key2: 'data 2-2', key3: 'data 2-3' }
  ]

  return (
    <Table>
      <thead>
        <tr>
          {cols.map((col) => (
            <th key={col.key}>{col.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {cols.map((col) => (
              <td key={col.key}>{item[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} align='center'>footer</td>
        </tr>
      </tfoot>
    </Table>
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
