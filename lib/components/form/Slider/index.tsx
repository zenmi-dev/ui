import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'

declare namespace Slider {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'defaultValue' | 'value'> & {
    defaultValue?: number
    value?: number
    onChangeValue?: (value: number) => any
  }
}

function Slider(
  {
    className, style,
    defaultValue,
    value: propsValue,
    onChangeValue,
    ...props
  }: Slider.Props
) {
  const [value, setValue] = useStateListner(propsValue as number, onChangeValue, defaultValue ?? 0)

  return (
    <label
      className={cls('ui-input ui-slider', className)}
      style={style}
    >
      <div className='ui-slider-bg'>
        <div style={{ width: `${value}%` }}></div>
      </div>
      <input
        {...props}
        type='range'
        min={0}
        max={100}
        value={value?.toString()}
        onChange={(e) => {
          props.onChange?.(e)
          setValue(Number(e.target.value))
        }}
      />
    </label>
  )
}

export default Slider
