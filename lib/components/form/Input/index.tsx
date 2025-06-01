import { useState } from 'react'
import { cls } from '../../../utils/index.js'
import { useComponentRef } from '../../tools'
import Icon from '../../common/Icon'

declare namespace Input {
  type Props = React.JSX.IntrinsicElements['input'] & {
    defaultValue?: string
    value?: string
    onChangeValue?: (value: string) => any
    before?: React.ReactNode
    after?: React.ReactNode
  }
  type PasswordProps = Input.Props & {
    visibilityToggle?: boolean
  }
  type NumberProps = Omit<Input.Props, 'defaultValue' | 'value' | 'onChangeValue'> & {
    defaultValue?: number
    value?: number
    onChangeValue?: (value: number) => any
    controls?: boolean
  }
}

function Input(
  {
    style, className,
    defaultValue,
    value,
    onChangeValue,
    before,
    after,
    ...props
  }: Input.Props
) {
  return (
    <label
      className={cls('ui-input ui-input-box', className)}
      style={style}
      tabIndex={-1}
    >
      {before}
      <input
        {...props}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeValue?.(e.target.value)
        }}
      />
      {after}
    </label>
  )
}

function InputPassword(
  {
    visibilityToggle = true,
    ...props
  }: Input.PasswordProps
) {
  const [password, setPassword] = useState(true)

  return (
    <Input
      {...props}
      className={cls('ui-input-password', props.className)}
      type={password ? 'password' : 'text'}
      after={props.after || visibilityToggle && (
        <Icon className='ui-input-icon' onClick={() => setPassword(!password)}>
          {password ? 'visibility_off' : 'visibility'}
        </Icon>
      )}
    />
  )
}

function InputNumber(
  {
    defaultValue,
    value,
    onChangeValue,
    controls = true,
    ...props
  }: Input.NumberProps
) {
  const [el, ref] = useComponentRef(props.ref)

  const plus = (n: number) => {
    if (el.current) {
      el.current[n < 0 ? 'stepDown' : 'stepUp']()
      onChangeValue?.(Number(el.current.value))
    }
  }

  return (
    <Input
      {...props}
      className={cls('ui-input-number', props.className)}
      ref={ref}
      type='number'
      autoComplete='off'
      defaultValue={defaultValue?.toString()}
      value={value?.toString()}
      onChange={(e) => {
        props.onChange?.(e)
        onChangeValue?.(Number(e.target.value))
      }}
      before={props.before || controls && (
        <Icon className='ui-input-icon' onClick={() => plus(-1)}>remove</Icon>
      )}
      after={props.after || controls && (
        <Icon className='ui-input-icon' onClick={() => plus(1)}>add</Icon>
      )}
    />
  )
}

Input.Password = InputPassword
Input.Number = InputNumber

export default Input
