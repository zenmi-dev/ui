import { cls } from '../../../utils/index.js'

declare namespace Card {
  type Props = React.JSX.IntrinsicElements['div']
}

function Card(props: Card.Props) {
  return (
    <div
      {...props}
      className={cls('ui-card', props.className)}
    >
      {props.children}
    </div>
  )
}

export default Card
