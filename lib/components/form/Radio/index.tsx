import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'

declare namespace Radio {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'defaultValue' | 'value'> & {
    defaultValue?: boolean
    value?: boolean
    onChangeValue?: (value: boolean) => any
  }
  type GroupProps = Omit<React.JSX.IntrinsicElements['input'], 'children'> & {
    options?: Option[]
    defaultValue?: string
    value?: string
    onChangeValue?: (value: string) => any
    children?: (option: Option) => React.ReactNode
  }
  type Option = {
    value: string
    label: string
    disabled?: boolean
  }
}

function Radio(
  {
    className, style, children,
    defaultValue,
    value,
    onChangeValue,
    ...props
  }: Radio.Props
) {
  return (
    <label
      className={cls('ui-input ui-radio', className)}
      style={style}
    >
      <input
        {...props}
        type='radio'
        defaultChecked={defaultValue}
        checked={value}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeValue?.(e.target.checked)
        }}
      />
      {!!children && <span>{children}</span>}
    </label>
  )
}

function RadioGroup(
  {
    className, style,
    options,
    defaultValue,
    value: propsValue,
    onChangeValue,
    children,
    ...props
  }: Radio.GroupProps
) {
  const [value, setValue] = useStateListner(propsValue as string, onChangeValue, defaultValue ?? '')

  return (
    <label
      className={cls('ui-input ui-radio-group', className)}
      style={style}
    >
      <input {...props} type='hidden' value={value} />
      {options?.map((option) => (
        <Radio
          key={option.value}
          value={option.value === value}
          onChangeValue={() => setValue(option.value)}
          disabled={props.disabled || option.disabled}
        >
          {children ? children(option) : option.label}
        </Radio>
      ))}
    </label>
  )
}

Radio.Group = RadioGroup

export default Radio
