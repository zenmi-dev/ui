import { cls } from '../../../utils/index.js'
import { useEffect, useMemo } from 'react'
import { useStateListner } from '../../tools'
import Icon from '../Icon'

declare namespace Pagination{
  type Props = React.JSX.IntrinsicElements['div'] & {
    total?: number
    page?: number
    onChangePage?: (page: number) => any
  }
}

function Pagination(
  {
    total = 10,
    page: propsPage,
    onChangePage,
    ...props
  }: Pagination.Props
) {
  const [page, setPage] = useStateListner(propsPage as number, onChangePage, 1)

  const pages = useMemo(() => {
    const result: any[] = []
    const curr = page < 1 || page > total ? 1 : page
    for (let i = curr - 4; i <= total; i++) {
      if (result.length === 5) {
        if (curr < i - 2) {
          break
        }
        result.shift()
      }
      if (i > 0) {
        result.push(i)
      }
    }
    if (result[0] !== 1) {
      result.unshift(1)
    }
    if (result[0] + 1 !== result[1]) {
      result.splice(1, 0, 'prev')
    }
    if (result[result.length - 1] !== total && total > 0) {
      result.push(total)
    }
    if (result[result.length - 2] + 1 !== result[result.length - 1]) {
      result.splice(result.length - 1, 0, 'next')
    }
    return result
  }, [total, page])

  useEffect(() => {
    if (!propsPage || propsPage < 1) {
      setPage(1)
    } else if (propsPage > total) {
      setPage(total)
    }
  }, [propsPage, total])

  const onClickPrevNext = (n: number) => {
    let newPage = page + n
    if (newPage < 1) {
      newPage = 1
    } else if (newPage > total) {
      newPage = total
    }
    setPage(newPage)
  }

  return (
    <div
      {...props}
      className={cls('ui-pagination', props.className)}
    >
      <Icon
        className={cls('ui-pagination-icon .ui-pagination-ellipsis', {
          'ui-disabled': page === 1
        })}
        onClick={() => onClickPrevNext(-1)}
      >
        keyboard_arrow_left
      </Icon>
      <span className='ui-pagination-group'>
        {pages.map((x) => typeof x === 'string' ? (
          <Icon 
            key={x}
            className='ui-pagination-icon'
            onClick={() => onClickPrevNext(x === 'prev' ? -5 : 5)}
          >
            more_horiz
          </Icon>
        ) : (
          <span
            key={x}
            className={cls('ui-pagination-item', {
              'ui-pagination-active': x === page
            })}
            onClick={() => setPage(x)}
          >
            {x}
          </span>
        ))}
      </span>
      <Icon
        className={cls('ui-pagination-icon', {
          'ui-disabled': page === total
        })}
        onClick={() => onClickPrevNext(1)}
      >
        keyboard_arrow_right
      </Icon>
    </div>
  )
}

export default Pagination
