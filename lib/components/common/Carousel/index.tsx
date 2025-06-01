import React, { use, useEffect, useMemo, useRef } from 'react'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'
import Icon from '../Icon'

declare namespace Carousel {
  type Props = React.JSX.IntrinsicElements['div'] & {
    activeKey?: any
    onChangeActiveKey?: (key: any) => any
  }
  type ItemProps = React.JSX.IntrinsicElements['div'] & {
    itemKey?: any
  }
}

const CarouselContext = React.createContext<{
  activeKey: any
} | null>(null)

function Carousel(
  {
    activeKey: propsActiveKey,
    onChangeActiveKey,
    ...props
  }: Carousel.Props
) {
  const group = useRef<HTMLDivElement>(null)
  const [activeKey, setActiveKey] = useStateListner(propsActiveKey, onChangeActiveKey)

  const [keys, Children] = useMemo(() => {
    const keys: any[] = []
    React.Children.forEach(props.children, (x: any) => {
      if (x?.type === CarouselItem) {
        keys.push(x.key ?? keys.length)
      }
    })
    const k = [...keys]
    const Children = React.Children.map(props.children, (x: any) => {
      if (x?.type === CarouselItem) {
        return React.cloneElement(x, { itemKey: k.shift(), ...x.props }, x.props.children)
      }
      return x
    })
    return [keys, Children]
  }, [props.children])
  const activeIndex = useMemo(() => {
    return keys.indexOf(activeKey)
  }, [keys, activeKey])

  useEffect(() => {
    if (keys[0] && keys.indexOf(propsActiveKey) === -1) {
      setActiveKey(keys[0])
    }
  }, [])
  useEffect(() => {
    if (group.current) {
      const el = group.current.querySelector('.ui-carousel-active')
      if (el) {
        const groupRect = group.current.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        group.current.style.transform = `translateX(-${elRect.left - groupRect.left}px)`
      }
    }
  }, [activeKey])

  const onClickPrevNext = (n: number) => {
    let index = keys.indexOf(activeKey) + n
    if (index < 0) {
      index = 0
    } else if (index > keys.length - 1) {
      index = keys.length - 1
    }
    setActiveKey(keys[index])
  }

  return (
    <div
      {...props}
      className={cls('ui-carousel', props.className)}
    >
      <Icon
        className={cls('ui-carousel-icon', {
          'ui-disabled': activeIndex === -1 || activeIndex === 0
        })}
        onClick={() => onClickPrevNext(-1)}
      >
        keyboard_arrow_left
      </Icon>
      <div className='ui-carousel-scroll'>
        <div ref={group} className='ui-carousel-group'>
          <CarouselContext.Provider value={{ activeKey }}>
            {Children}
          </CarouselContext.Provider>
        </div>
      </div>
      <Icon
        className={cls('ui-carousel-icon', {
          'ui-disabled': activeIndex === -1 || activeIndex === keys.length - 1
        })}
        onClick={() => onClickPrevNext(1)}
      >
        keyboard_arrow_right
      </Icon>
    </div>
  )
}

function CarouselItem(
  {
    itemKey,
    ...props
  }: Carousel.ItemProps
) {
  const { activeKey } = use(CarouselContext)!

  return (
    <div
      {...props}
      className={cls('ui-carousel-item', {
        'ui-carousel-active': itemKey === activeKey
      }, props.className)}
    >
      {props.children}
    </div>
  )
}

Carousel.Item = CarouselItem

export default Carousel
