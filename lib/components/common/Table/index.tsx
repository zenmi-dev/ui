import { cls } from '../../../utils/index.js'

declare namespace Table {
  type Props = React.JSX.IntrinsicElements['div']
}

function Table(props: Table.Props) {
  return (
    <div
      {...props}
      className={cls('ui-table', props.className)}
    >
      <table>
        {props.children}
      </table>
    </div>
  )
}

export default Table
