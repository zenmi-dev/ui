import { cls } from '../../../utils/index.js'

declare namespace Button {
  type Props = React.JSX.IntrinsicElements['button']
}

function Button(props: Button.Props) {
  return (
    <button
      {...props}
      className={cls('ui-button', props.className)}
    >
      {props.children}
    </button>
  )
}

export default Button
