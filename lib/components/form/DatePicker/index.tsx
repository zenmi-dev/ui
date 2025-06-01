import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { cls } from '../../../utils/index.js'
import { useEventListener, useResizeObserver, useThrottle } from '../../../hooks/index.js'
import { useComponentRef, useStateListner } from '../../tools'
import Icon from '../../common/Icon'
import Popover from '../../common/Popover'
import Calendar from '../../common/Calendar'

dayjs.extend(customParseFormat)

declare namespace DatePicker {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'defaultValue' | 'value'> & {
    defaultValue?: dayjs.ConfigType
    value?: dayjs.ConfigType
    onChangeValue?: (value: dayjs.Dayjs | null) => any
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    type?: 'date' | 'datetime' | 'time'
    format?: string
    showSeconds?: boolean
    use12Hour?: boolean
    hourStep?: number
    minuteStep?: number
    secondStep?: number
    minDate?: dayjs.ConfigType
    maxDate?: dayjs.ConfigType
    disabledDate?: (date: dayjs.Dayjs) => boolean
    disabledHours?: () => number[]
    disabledMinutes?: (hour?: number) => number[]
    disabledSeconds?: (hour?: number, minute?: number) => number[]
    hideDisabled?: boolean
    before?: React.ReactNode
    after?: React.ReactNode
    footer?: React.ReactNode
    monthRender?: (year: number, month: number) => React.ReactNode
    weekRender?: (week: number) => React.ReactNode
    dateRender?: (date: dayjs.Dayjs) => React.ReactNode
    timeRender?: (type: 'hour' | 'minute' | 'second', n: number) => React.ReactNode
  }
}

function DatePicker(
  {
    style, className,
    defaultValue,
    value: propsValue,
    onChangeValue,
    open: propsOpen,
    onChangeOpen,
    type = 'date',
    format: propsFormat,
    showSeconds = true,
    use12Hour = true,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    minDate = null,
    maxDate = null,
    disabledDate,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabled = false,
    before,
    after,
    footer,
    monthRender,
    weekRender,
    dateRender,
    timeRender,
    ...props
  }: DatePicker.Props
) {
  const el = useRef<HTMLLabelElement>(null)
  const [inputEl, ref] = useComponentRef(props.ref)
  const calendarEl = useRef<HTMLDivElement>(null)
  const [value, setValue] = useStateListner(propsValue, onChangeValue as any, defaultValue ?? null)
  const [text, setText] = useState('')
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const stayOpen = useRef(false)
  const A = useRef('AM')

  const format = useMemo(() => {
    if (propsFormat) {
      return propsFormat
    }
    const timeFormat = showSeconds ? (
      use12Hour ? 'hh:mm:ss A' : 'HH:mm:ss'
    ) : (
      use12Hour ? 'hh:mm A' : 'HH:mm'
    )
    const f = {
      date: `YYYY-MM-DD`,
      datetime: `YYYY-MM-DD ${timeFormat}`,
      time: timeFormat
    }
    return f[type]
  }, [propsFormat, type, showSeconds])
  const formatDate = useMemo(() => {
    return dayjs(value).isValid() ? dayjs(value).format(format) : ''
  }, [value, format])
  const [hours, minutes, seconds] = useMemo(() => {
    const hours = [...Array(use12Hour ? 12 : 24)].map((_, i) => i)
    const minutes = [...Array(60)].map((_, i) => i)
    const seconds = [...Array(60)].map((_, i) => i)
    return [hours, minutes, seconds]
  }, [hourStep, minuteStep, secondStep])
  const [disabledH, disabledM, disabledS] = useMemo(() => {
    const hour = dayjs(value).hour()
    const minute = dayjs(value).minute()
    return [disabledHours?.(), disabledMinutes?.(hour), disabledSeconds?.(hour, minute)]
  }, [value])

  useEffect(() => {
    setText(formatDate)
    A.current = dayjs(value).isValid() ? dayjs(value).format('A') : 'AM'
  }, [value])
  useEffect(() => {
    if (open) {
      scrollToActive({ behavior: 'smooth', block: 'start' })
    }
  }, [value, text])
  useEffect(() => {
    if (open) {
      requestAnimationFrame(renderTimePicker)
    }
  }, [open])

  const changeValue = (date: dayjs.Dayjs | null) => {
    if (date === null) {
      setValue(null)
      return
    } 
    if (date.isBefore(minDate, 'day') || date.isAfter(maxDate, 'day')) {
      setText(formatDate)
      return
    }
    if (!date.isSame(value)) {
      setValue(date)
    } else {
      setText(formatDate)
    }
  }
  const onClickTime = (type: 'hour' | 'minute' | 'second' | 'AM' | 'PM', n: number) => {
    let newValue: dayjs.Dayjs
    if (dayjs(value).isValid()) {
      newValue = dayjs(value)
    } else {
      const h = Array(24).findIndex((_, i) => !disabledH?.includes(i))
      const m = Array(60).findIndex((_, i) => !disabledM?.includes(i))
      const s = Array(60).findIndex((_, i) => !disabledS?.includes(i))
      newValue = dayjs().hour(Math.max(h, 0)).minute(Math.max(m, 0)).second(Math.max(s, 0))
    }
    if (type !== 'AM' && type !== 'PM') {
      newValue = newValue[type](n)
    } else {
      A.current = type
    }
    if (use12Hour) {
      const f = 'YYYY-MM-DDThh:mm:ss'
      changeValue(dayjs(newValue.format(f) + A.current, `${f}A`))
    } else {
      changeValue(dayjs(newValue))
    }
  }
  const scrollToActive = (arg?: boolean | ScrollIntoViewOptions) => {
    const els = document.querySelectorAll('.ui-date-picker-time-active')
    for (let i = 0; i < els.length; i++) {
      els[i].scrollIntoView(arg)
    }
  }
  const renderTimePicker = useThrottle(() => {
    const el = calendarEl.current?.nextElementSibling as HTMLElement
    if (el && calendarEl.current) {
      const rect = calendarEl.current.getBoundingClientRect()
      el.style.height = `${rect.height}px`
      el.removeAttribute('hidden')
    }
    scrollToActive()
  })

  useEventListener('resize', renderTimePicker)
  useResizeObserver(calendarEl, renderTimePicker)

  return (
    <label
      className={cls('ui-input ui-input-box ui-date-picker', {
        [`ui-date-picker-${type}`]: type
      }, className)}
      style={style}
      tabIndex={-1}
      ref={el}
      onMouseDown={(e) => {
        if (el.current?.contains(e.target as HTMLElement)) {
          setOpen(!open)
        }
      }}
      onClick={() => inputEl.current?.focus()}
    >
      {before}
      <input {...props} type='hidden' value={dayjs(value).isValid() ? dayjs(value).format() : ''} />
      <input
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={props.placeholder || format}
        disabled={props.disabled}
        onBlur={() => {
          if (stayOpen.current) {
            stayOpen.current = false
            inputEl.current?.focus()
            return
          }
          setOpen(false)
          if (!text) {
            changeValue(null)
            return
          }
          const str = type === 'time' ? dayjs().format('YYYY-MM-DDT') + text : text
          if (dayjs(str).isValid()) {
            changeValue(dayjs(str))
            return
          } else if (dayjs(text, format)) {
            changeValue(dayjs(text, format))
            return
          }
          setText(formatDate)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setOpen(!open)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {after || (
        <Icon className='ui-input-icon' size={16}>calendar_today</Icon>
      )}
      <Popover
        open={open}
        className={cls('ui-date-picker-popover', {
          [`ui-date-picker-${type}`]: type,
          'ui-disabled': props.disabled
        })}
        trigger="click"
        position='bottom-left'
        onMouseDown={() => stayOpen.current = true}
      >
        <div className='ui-date-picker-body'>
          {type !== 'time' && (
            <Calendar
              ref={calendarEl}
              date={value}
              onChangeDate={(date) => {
                if (type !== 'date' && dayjs(value).isValid()) {
                  date = date.add(dayjs(value).diff(dayjs(value).startOf('day')))
                }
                changeValue(date)
                if (type === 'date') {
                  setOpen(false)
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
              disabledDate={disabledDate}
              monthRender={monthRender}
              weekRender={weekRender}
              dateRender={dateRender}
            />
          )}
          {type !== 'date' && (
            <div
              className='ui-date-picker-time-options'
              hidden={type === 'datetime'}
              style={{ height: 232 }}
            >
              <div className='ui-date-picker-time-unit'>
                {hours.map((n) => !(hideDisabled && disabledH?.includes(n)) && (
                  <div
                    key={n}
                    className={cls({
                      'ui-date-picker-time-active': n === (use12Hour ? dayjs(value).hour() % 12 : dayjs(value).hour()),
                      'ui-disabled': disabledH?.includes(n)
                    })}
                    onClick={() => onClickTime('hour', n)}
                  >
                    {timeRender ? (
                      timeRender('hour', n)
                    ) : (
                      use12Hour && n === 0 ? 12 : String(n).padStart(2, '0')
                    )}
                  </div>
                ))}
                <div></div>
              </div>
              <div className='ui-date-picker-time-unit'>
                {minutes.map((n) => (
                  <div
                    key={n}
                    className={cls({
                      'ui-date-picker-time-active': n === dayjs(value).minute(),
                      'ui-disabled': disabledM?.includes(n)
                    })}
                    onClick={() => onClickTime('minute', n)}
                  >
                    {timeRender ? timeRender('minute', n) : String(n).padStart(2, '0')}
                  </div>
                ))}
                <div></div>
              </div>
              {showSeconds && (
                <div className='ui-date-picker-time-unit'>
                  {seconds.map((n) => (
                    <div
                      key={n}
                      className={cls({
                        'ui-date-picker-time-active': n === dayjs(value).second(),
                        'ui-disabled': disabledS?.includes(n)
                      })}
                      onClick={() => onClickTime('second', n)}
                    >
                      {timeRender ? timeRender('second', n) : String(n).padStart(2, '0')}
                    </div>
                  ))}
                  <div></div>
                </div>
              )}
              {use12Hour && (
                <div className='ui-date-picker-time-unit'>
                  {['AM', 'PM'].map((x) => (
                    <div
                      key={x}
                      className={cls({
                        'ui-date-picker-time-active': x === dayjs(value).format('A')
                      })}
                      onClick={() => onClickTime(x as any, 0)}
                    >
                      {x}
                    </div>
                  ))}
                  <div hidden></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='ui-date-picker-footer'>
          {footer ||  (
            <div className='ui-date-picker-action'>
              <button
                className='ui-date-picker-button'
                disabled={props.disabled}
                onClick={() => {
                  changeValue(type === 'date' ? dayjs().startOf('day') : dayjs())
                  setOpen(false)
                }}
              >
                {type === 'date' ? 'Today' : 'Now'}
              </button>
              {type !== 'date' && (
                <button
                  className='ui-date-picker-button'
                  disabled={props.disabled}
                  onClick={() => {
                    if (!dayjs(value).isValid()) {
                      changeValue(dayjs().startOf('day'))
                    }
                    setOpen(false)
                  }}
                >
                  OK
                </button>
              )}
            </div>
          )}
        </div>
      </Popover>
    </label>
  )
}

export default DatePicker
