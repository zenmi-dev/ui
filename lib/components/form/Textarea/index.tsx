import { useEffect, useState } from 'react'
import { cls } from '../../../utils/index.js'

declare namespace Textarea {
  type Props = React.JSX.IntrinsicElements['textarea'] & {
    defaultValue?: string
    value?: string
    onChangeValue?: (value: string) => any
    autoRows?: boolean | {
      min?: number
      max?: number
    }
  }
}

function Textarea(
  {
    className, style,
    defaultValue,
    value,
    onChangeValue,
    autoRows,
    ...props
  }: Textarea.Props
) {
  const getRows = (value: string = '') => {
    let rows = props.rows
    if (autoRows) {
      rows = value.split('\n').length
      if (typeof autoRows === 'object') {
        if (rows < Number(autoRows.min)) {
          rows = autoRows.min
        } else if (rows > Number(autoRows.max)) {
          rows = autoRows.max
        }
      }
    }
    return rows
  }

  const [rows, setRows] = useState(() => getRows(defaultValue))

  useEffect(() => {
    setRows(getRows(value))
  }, [value])

  return (
    <label
      className={cls('ui-input ui-input-box ui-textarea', className)}
      style={style}
      tabIndex={-1}
    >
      <textarea
        {...props}
        style={{ resize: autoRows ? 'none' : 'vertical' }}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeValue?.(e.target.value)
          setRows(getRows(e.target.value))
        }}
        rows={rows}
      />
    </label>
  )
}

export default Textarea
