import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cls } from '../../../utils/index.js'
import { useStateListner } from '../../tools'
import Icon from '../../common/Icon'
import Dropdown from '../../common/Dropdown'

declare namespace Select {
  type Props = SingleProps | MultipleProps
  type CommonProps = Omit<React.JSX.IntrinsicElements['input'], 'value' | 'defaultValue'> & {
    options?: Option[]
    open?: boolean
    onChangeOpen?: (open: boolean) => any
    optionsMaxHeight?: number
    before?: React.ReactNode
    after?: React.ReactNode
    children?: (option: Option) => React.ReactNode
    tagRender?: (option: Option) => React.ReactNode
  }
  type SingleProps = CommonProps & {
    multiple?: false
    defaultValue?: string
    value?: string
    onChangeValue?: (value: string) => any
  }
  type MultipleProps = CommonProps & {
    multiple: true
    defaultValue?: string[]
    value?: string[]
    onChangeValue?: (value: string[]) => any
  }
  type Option = {
    value: string
    label: string
    disabled?: boolean
  }
}

function Select(
  {
    style, className,
    multiple,
    defaultValue,
    value: propsValue,
    onChangeValue,
    options,
    open: propsOpen,
    onChangeOpen,
    optionsMaxHeight,
    before,
    after,
    children,
    tagRender,
    ...props
  }: Select.Props
) {
  const el = useRef<HTMLLabelElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)
  const [value, setValue] = useStateListner(
    propsValue as string | string[],
    onChangeValue as any,
    defaultValue ?? (multiple ? [] : '')
  )
  const [open, setOpen] = useStateListner(propsOpen as boolean, onChangeOpen)
  const [search, setSearch] = useState('')
  const [clear, setClear] = useState(false)
  const [index, setIndex] = useState(0)
  const stayOpen = useRef(false)

  const activeOption = useMemo(() => {
    return !multiple && options?.find((x) => x.value === value) || null
  }, [options, value, multiple])
  const activeOptions = useMemo(() => {
    return multiple && options?.filter((x) => value.includes(x.value)) || []
  }, [options, value, multiple])
  const filterOptions = useMemo(() => {
    return options?.filter((x) => !search || x.label.includes(search)) || []
  }, [options, search])

  useEffect(() => {
    if (open) {
      setClear(false)
    } else {
      setClear(true)
      const timer = window.setTimeout(() => {
        setSearch('')
        setClear(false)
      }, 300)
      return () => window.clearTimeout(timer)
    }
  }, [open])
  useEffect(() => {
    if (open) {
      changeIndex(0)
    }
  }, [open, filterOptions])
  useEffect(() => {
    if (open) {
      const el = document.querySelector('.ui-select-hover')
      if (el) {
        el.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [index])
  useEffect(() => {
    if (!activeOptions.length) {
      inputEl.current?.removeAttribute('style')
    }
  }, [activeOptions])

  const changeValue = (v: string) => {
    if (multiple) {
      const newValue = value as string[]
      if (!newValue.includes(v)) {
        setValue([...newValue, v])
      } else {
        setValue(newValue.filter((x) => x !== v))
      }
    } else {
      setValue(v)
    }
  }
  const changeIndex = (n: number) => {
    let newIndex = (index + n) % filterOptions.length
    if (n === 0) {
      newIndex = filterOptions.findLastIndex((x) => activeOptions.includes(x))
      if (newIndex === -1) {
        newIndex += 1
      }
    }
    for (let i = 0; i < filterOptions.length; i++) {
      const option = filterOptions[newIndex]
      if (option && !option.disabled) {
        break
      }
      newIndex += n > 0 ? 1 : -1
      if (newIndex < 0) {
        newIndex = filterOptions.length
      } else if (newIndex > filterOptions.length) {
        newIndex = 0
      }
    }
    setIndex(newIndex)
  }

  return (
    <label
      className={cls('ui-input ui-input-box ui-select', {
        'ui-select-multiple': multiple,
        'ui-select-open': open
      }, className)}
      style={style}
      tabIndex={-1}
      ref={el}
      onMouseDown={(e) => {
        if (el.current?.contains(e.target as HTMLElement)) {
          setOpen(!open)
        }
      }}
      onClick={() => inputEl.current?.focus()}
    >
      {before}
      <input {...props} type='hidden' value={value} />
      <div
        className={cls({ 'ui-select-tags': activeOptions.length })}
        onMouseDown={(e) => {
          if (e.target !== inputEl.current) {
            e.stopPropagation()
            stayOpen.current = true
          }
        }}
      >
        {activeOptions.map((option) => (
          <React.Fragment key={option.value}>
            {tagRender ? (
              tagRender(option)
            ) : (
              <span className='ui-select-tag'>
                <span>{option.label}</span>
                <Icon className='ui-input-icon' size={16} onClick={() => changeValue(option.value)}>
                  close
                </Icon>
              </span>
            )}
          </React.Fragment>
        ))}
        <input
          ref={inputEl}
          className={cls('ui-select-search', {
            'ui-select-has-value': value
          })}
          value={clear ? '' : search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
            if (activeOptions.length) {
              const span = document.createElement('span')
              span.textContent = e.target.value
              document.body.appendChild(span)
              if (inputEl.current) {
                inputEl.current.style.width = `${span.offsetWidth}px`
              }
              span.remove()
            }
          }}
          disabled={props.disabled}
          placeholder={!multiple && activeOption?.label || props.placeholder}
          onBlur={() => {
            if (stayOpen.current) {
              stayOpen.current = false
              inputEl.current?.focus()
              return
            }
            setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key.startsWith('Arrow')) {
              setOpen(true)
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
            if (open) {
              if (e.key === 'ArrowUp') {
                changeIndex(-1)
              } else if (e.key === 'ArrowDown') {
                changeIndex(1)
              } else if (e.key === 'Enter') {
                const option = filterOptions[index]
                if (option) {
                  changeValue(option.value)
                  setSearch('')
                }
                if (!multiple) {
                  setOpen(false)
                }
              }
            }
          }}
        />
      </div>
      {after || (
        <Icon className='ui-input-icon'>keyboard_arrow_down</Icon>
      )}
      <Dropdown open={open}>
        <Dropdown.Content
          className='ui-select-dropdown'
          onMouseDown={() => stayOpen.current = true}
        >
          {filterOptions.length ? (
            <div
              className='ui-select-options'
              style={{ maxHeight: optionsMaxHeight }}
            >
              {filterOptions.map((option, i) => (
                <div
                  key={option.value}
                  className={cls({
                    'ui-select-hover': i === index && !(props.disabled || option.disabled),
                    'ui-select-active': multiple ? value.includes(option.value) : option.value === value, 
                    'ui-select-disabled': props.disabled || option.disabled
                  })}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    if (props.disabled || option.disabled) {
                      return 
                    }
                    changeValue(option.value)
                    if (!multiple) {
                      setOpen(false)
                    }
                  }}
                >
                  {children ? (
                    children(option)
                  ) : (
                    <>
                      <span>{option.label}</span>
                      {multiple && value.includes(option.value) && (
                        <Icon className='ui-input-icon' size={16}>check</Icon>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='ui-select-no-data'>No data</div>
          )}
        </Dropdown.Content>
      </Dropdown>
    </label>
  )
}

export default Select
