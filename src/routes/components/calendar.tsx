import Component from '../../common/Component'
import { Calendar } from '../../../lib/components'

const Title = 'Calendar'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: [
      { prop: 'date', type: 'dayjs.ConfigType' },
      { prop: 'onChangeDate', type: '(date: dayjs.Dayjs) => any' },
      { prop: 'minDate', type: 'dayjs.ConfigType', defaultValue: null },
      { prop: 'maxDate', type: 'dayjs.ConfigType', defaultValue: null },
      { prop: 'disabledDate', type: '(date: dayjs.Dayjs) => boolean' },
      { prop: 'monthRender', type: '(year: number, month: number) => React.ReactNode' },
      { prop: 'weekRender', type: '(week: number) => React.ReactNode' },
      { prop: 'dateRender', type: '(date: dayjs.Dayjs) => React.ReactNode' }
    ]
  }
]
const Code = `
import { Calendar } from '@zenmi/ui'

export function Example() {
  return (
    <Calendar />
  )
}
`
function Example() {
  return (
    <Calendar />
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
