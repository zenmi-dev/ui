import Component from '../../common/Component'
import { DatePicker } from '../../../lib/components'

const Title = 'DatePicker'
const TypeTimeRender = `
(
  type: 'hour' | 'minute' | 'second',
  n: number
) => React.ReactNode
`
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/hidden',
    props: [
      { prop: 'defaultValue', type: 'dayjs.ConfigType' },
      { prop: 'value', type: 'dayjs.ConfigType' },
      { prop: 'onChangeValue', type: '(value: dayjs.Dayjs | null) => any' },
      { prop: 'open', type: 'boolean', defaultValue: false },
      { prop: 'onChangeOpen', type: '(open: boolean) => any' },
      { prop: 'type', type: `'date' | 'datetime' | 'time'` },
      { prop: 'format', type: 'string', defaultValue: 'YYYY-MM-DD' },
      { prop: 'showSeconds', type: 'boolean', defaultValue: true },
      { prop: 'use12Hour', type: 'boolean', defaultValue: true },
      { prop: 'hourStep', type: 'number', defaultValue: 1 },
      { prop: 'minuteStep', type: 'number', defaultValue: 1 },
      { prop: 'secondStep', type: 'number', defaultValue: 1 },
      { prop: 'minDate', type: 'dayjs.ConfigType', defaultValue: null },
      { prop: 'maxDate', type: 'dayjs.ConfigType', defaultValue: null },
      { prop: 'disabledDate', type: '(date: dayjs.Dayjs) => boolean' },
      { prop: 'disabledHours', type: 'number[]' },
      { prop: 'disabledMinutes', type: '(hour: number) => number[]' },
      { prop: 'disabledSeconds', type: '(hour: number, minute: number) => number[]' },
      { prop: 'hideDisabled', type: 'boolean', defaultValue: false },
      { prop: 'before', type: 'React.ReactNode' },
      { prop: 'after', type: 'React.ReactNode' },
      { prop: 'footer', type: 'React.ReactNode' },
      { prop: 'monthRender', type: '(year: number, month: number) => React.ReactNode' },
      { prop: 'weekRender', type: '(week: number) => React.ReactNode' },
      { prop: 'dateRender', type: '(date: dayjs.Dayjs) => React.ReactNode' },
      { prop: 'timeRender', type: TypeTimeRender}
    ]
  }
]
const Code = `
import { DatePicker } from '@zenmi/ui'

export function Example() {
  return (
    <DatePicker />
  )
}
`
function Example1() {
  return (
    <DatePicker type='date' />
  )
}
function Example2() {
  return (
    <DatePicker type='datetime' />
  )
}
function Example3() {
  return (
    <DatePicker type='time' />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        {
          name: 'Date',
          code: Code,
          element: <Example1 />,
          center: true
        },
        {
          name: 'Datetime',
          code: Code.replace(/(\/>)/, 'type=\'datetime\' $1'),
          element: <Example2 />,
          center: true
        },
        {
          name: 'Time',
          code: Code.replace(/(\/>)/, 'type=\'time\' $1'),
          element: <Example3 />,
          center: true
        }
      ]}
      apiItems={ApiItems}
    />
  )
}
