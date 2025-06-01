import { useEffect } from 'react'
import { cls } from '../../../utils/index.js'
import { useComponentRef, useStateListner } from '../../tools'

declare namespace Checkbox {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'defaultValue' | 'value'> & {
    defaultValue?: boolean
    value?: boolean
    onChangeValue?: (value: boolean) => any
    indeterminate?: boolean
  }
  type GroupProps = Omit<React.JSX.IntrinsicElements['input'], 'children'> & {
    options?: Option[]
    defaultValue?: string[]
    value?: string[]
    onChangeValue?: (value: string[]) => any
    children?: (option: Option) => React.ReactNode
  }
  type Option = {
    value: string
    label: string
    disabled?: boolean
  }
}

function Checkbox(
  {
    className, style, children,
    defaultValue,
    value,
    onChangeValue,
    indeterminate,
    ...props
  }: Checkbox.Props
) {
  const [el, ref] = useComponentRef(props.ref)

  useEffect(() => {
    if (el.current) {
      el.current.indeterminate = !!indeterminate
    }
  }, [indeterminate])

  return (
    <label
      className={cls('ui-input ui-checkbox', className)}
      style={style}
    >
      <input
        {...props}
        type='checkbox'
        defaultChecked={defaultValue}
        checked={value}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeValue?.(e.target.checked)
        }}
        ref={ref}
      />
      {!!children && <span>{children}</span>}
    </label>
  )
}

function CheckboxGroup(
  {
    className, style,
    options,
    defaultValue,
    value: propsValue,
    onChangeValue,
    children,
    ...props
  }: Checkbox.GroupProps
) {
  const [value, setValue] = useStateListner(propsValue as string[], onChangeValue, defaultValue ?? [])

  const changeValue = (option: string, v: boolean) => {
    if (v) {
      if (!value.includes(option)) {
        setValue([...value, option])
      }
    } else {
      if (value.includes(option)) {
        setValue(value.filter((x) => x !== option))
      }
    }
  }

  return (
    <label
      className={cls('ui-input ui-checkbox-group', className)}
      style={style}
    >
      <input {...props} type='hidden' value={value} />
      {options?.map((option) => (
        <Checkbox
          key={option.value}
          value={value.includes(option.value)}
          onChangeValue={(v) => changeValue(option.value, v)}
          disabled={props.disabled || option.disabled}
        >
          {children ? children(option) : option.label}
        </Checkbox>
      ))}
    </label>
  )
}

Checkbox.Group = CheckboxGroup

export default Checkbox
