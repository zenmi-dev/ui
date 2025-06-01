import { cls } from '../../../utils/index.js'

declare namespace ColorPicker {
  type Props = React.JSX.IntrinsicElements['input'] & {
    defaultValue?: string
    value?: string
    onChangeValue?: (value: string) => any
  }
}

function ColorPicker(
  {
    className, style,
    defaultValue,
    value,
    onChangeValue,
    ...props
  }: ColorPicker.Props
) {
  return (
    <label
      className={cls('ui-input ui-color-picker', className)}
      style={style}
    >
      <input
        {...props}
        type='color'
        value={value}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeValue?.(e.target.value)
        }}
      />
    </label>
  )
}

export default ColorPicker
