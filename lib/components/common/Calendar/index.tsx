import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'
import Icon from '../Icon'

declare namespace Calendar {
  type Props = React.JSX.IntrinsicElements['div'] & {
    date?: dayjs.ConfigType
    onChangeDate?: (date: dayjs.Dayjs) => any
    minDate?: dayjs.ConfigType
    maxDate?: dayjs.ConfigType
    disabledDate?: (date: dayjs.Dayjs) => boolean
    monthRender?: (year: number, month: number) => React.ReactNode
    weekRender?: (week: number) => React.ReactNode
    dateRender?: (date: dayjs.Dayjs) => React.ReactNode
  }
}

function Calendar(
  {
    date: propsDate,
    onChangeDate,
    minDate = null,
    maxDate = null,
    disabledDate,
    monthRender,
    weekRender,
    dateRender,
    ...props
  }: Calendar.Props
) {
  const [date, setDate] = useStateListner(propsDate as any, onChangeDate)
  const [month, setMonth] = useState(() => {
    let M = dayjs(date).isValid() ? dayjs(date) : dayjs()
    if (M.isBefore(minDate, 'month')) {
      M = dayjs(minDate)
    } else if (M.isAfter(maxDate, 'month')) {
      M = dayjs(maxDate)
    }
    return M.startOf('month')
  })

  const [week, days] = useMemo(() => {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(dayjs().startOf('week').add(i, 'day').format('dd'))
    }
    const days = []
    const monthStart = Number(month.startOf('month').format('d'))
    const monthEnd = Number(month.endOf('month').format('d'))
    const daysInMonth = month.daysInMonth()
    for (let i = 0 - monthStart; i < daysInMonth + 6 - monthEnd; i++) {
      days.push(month.startOf('month').add(i, 'day'))
    }
    return [week, days]
  }, [month])

  const onClickDate = (d: dayjs.Dayjs) => {
    if (d.isBefore(minDate, 'day') || d.isAfter(maxDate, 'day')) {
      return
    }
    if (!d.isSame(date, 'day')) {
      setDate(d)
    }
    if (!d.isSame(month, 'month')) {
      setMonth(d.startOf('month'))
    }
  }
  const onClickPrevNext = (n: number) => {
    const M = month.add(n, 'month')
    if (M.isBefore(minDate, 'month') || M.isAfter(maxDate, 'month')) {
      return
    }
    if (!M.isSame(month, 'month')) {
      setMonth(M)
    }
  }

  return (
    <div
      {...props}
      className={cls('ui-calendar', props.className)}
    >
      <div className='ui-calendar-title'>
        <Icon
          className={cls('ui-calendar-icon', {
            'ui-disabled': month.isSame(minDate, 'year') || month.isBefore(minDate, 'year')
          })}
          onClick={() => onClickPrevNext(-12)}
        >
          keyboard_double_arrow_left
        </Icon>
        <Icon
          className={cls('ui-calendar-icon', {
            'ui-disabled': month.isSame(minDate, 'month') || month.isBefore(minDate, 'month')
          })}
          onClick={() => onClickPrevNext(-1)}
        >
          keyboard_arrow_left
        </Icon>
        <span className='ui-calendar-month'>
          {monthRender ? monthRender(month.year(), month.month()) : month.format('MMMM YYYY')}
        </span>
        <Icon
          className={cls('ui-calendar-icon', {
            'ui-disabled': month.isSame(maxDate, 'month') || month.isAfter(maxDate, 'month')
          })}
          onClick={() => onClickPrevNext(1)}
        >
          keyboard_arrow_right
        </Icon>
        <Icon
          className={cls('ui-calendar-icon', {
            'ui-disabled': month.isSame(maxDate, 'year') || month.isAfter(maxDate, 'year')
          })}
          onClick={() => onClickPrevNext(12)}
        >
          keyboard_double_arrow_right
        </Icon>
      </div>
      <div className='ui-calendar-week'>
        {week.map((name, i) => (
          <span key={name}>
            {weekRender ? weekRender(i) : name}
          </span>
        ))}
      </div>
      <div className='ui-calendar-days'>
        {days.map((day) => (
          <span
            key={day.format('YYYYMMDD')}
            className={cls({
              'ui-calendar-day': !(day.isBefore(month, 'month') || day.isAfter(month, 'month')),
              'ui-calendar-active': day.isSame(date, 'day'),
              'ui-disabled': day.isBefore(minDate, 'day') || day.isAfter(maxDate, 'day') || disabledDate?.(day)
            })}
            onClick={() => onClickDate(day)}
          >
            {dateRender ? dateRender(day) : day.format('DD')}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Calendar
