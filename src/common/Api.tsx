import React from 'react'
import { Table } from '../../lib/components'

declare namespace Api {
  type Props = {
    items?: Item[]
  }
  type Item = {
    name: string,
    wraps?: string,
    props?: PropItem[],
    description?: React.ReactNode
  }
  type PropItem = {
    prop: string
    type: string,
    defaultValue?: any
  }
}

const Reference = {
  HTML: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/',
  File: 'https://developer.mozilla.org/en-US/docs/Web/API/File',
  dayjs: 'https://day.js.org',
  icon: 'https://fonts.google.com/icons'
}
const Cols: {
  key: keyof Api.PropItem
  name: string
  render?: (item: Api.PropItem) => React.ReactNode
}[] = [
  { key: 'prop', name: 'Prop' },
  {
    key: 'type',
    name: 'Type',
    render: (item) => {
      if (item.type.includes('File')) {
        return (
          <>
            <span>{item.type.split('File')[0]}</span>
            <a href={Reference.File} target='_blank'>File</a>
            <span>{item.type.split('File')[1]}</span>
          </>
        )
      } else if (item.type.includes('dayjs')) {
        return (
          <>
            <span>{item.type.split('dayjs.')[0]}</span>
            <a href={Reference.dayjs} target='_blank'>dayjs</a>
            <span>{`.${item.type.split('dayjs.')[1]}`}</span>
          </>
        )
      } else if (item.type === 'icon') {
        return (
          <a href={Reference.icon} target='_blank'>Material Symbols & Icon</a>
        )
      }
      return item.type.replace(/"/g, '\'').trim()
    }
  },
  {
    key: 'defaultValue',
    name: 'Default',
    render: (item) => item.defaultValue !== void 0 ?
      JSON.stringify(item.defaultValue).replace(/"/g, '\'') : '-'
  }
]

function Api(
  {
    items
  }: Api.Props
) {
  return !!items?.length && (
    <div translate='no'>
      <h2>API</h2>
      {items.map((item) => (
        <React.Fragment key={item.name}>
          {item.wraps ? (
            <div className='api-wraps'>
              <h3>{item.name}</h3>
              <span>wraps</span>
              <a href={Reference.HTML + item.wraps} target='_blank'>
                {(() => {
                  const [el, type] = item.wraps.split('/')
                  return `<${el}${type ? ` type="${type}"`: ''}>`
                })()}
              </a>
              <span>and accepts all props it supports.</span>
            </div>
          ) : (
            <h3>{item.name}</h3>
          )}
          {item.props && (
            <Table className='api-table'>
              <thead>
                <tr>
                  {Cols.map((col) => (
                    <th key={col.key}>{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.props.length ? (
                  item.props.map((prop) => (
                    <tr key={prop.prop}>
                      {Cols.map((col) => (
                        <td key={col.key}>
                          <pre>{col.render ? col.render(prop) : prop[col.key]}</pre>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className='api-none' colSpan={3} align='center'>None</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
          {item.description && (
            <div className='api-description'>{item.description}<br /></div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Api
