import { cls } from '../../../utils/index.js'

declare namespace Switch {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'defaultValue' | 'value'> & {
    defaultValue?: boolean
    value?: boolean
    onChangeValue?: (value: boolean) => any
  }
}

function Switch(
  {
    className, style, children,
    defaultValue,
    value,
    onChangeValue,
    ...props
  }: Switch.Props
) {
  return (
    <label
      className={cls('ui-input ui-switch', className)}
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
      />
      <span></span>
    </label>
  )
}

export default Switch
