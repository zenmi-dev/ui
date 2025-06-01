import { cls } from '../../../utils/index.js'

declare namespace Divider {
  type Props = React.JSX.IntrinsicElements['div'] & {
    type?: 'horizontal' | 'vertical'
  }
}

function Divider(
  {
    type = 'horizontal',
    ...props
  }: Divider.Props
) {
  return (
    <div
      {...props}
      className={cls('ui-divider', {
        [`ui-divider-${type}`]: type
      }, props.className)}
    ></div>
  )
}

export default Divider
