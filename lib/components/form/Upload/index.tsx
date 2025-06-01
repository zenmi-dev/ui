import React, { useEffect } from 'react'
import { cls } from '../../../utils/index.js'
import { useComponentRef, useStateListner } from '../../tools'
import Button from '../../common/Button'
import Icon from '../../common/Icon'

declare namespace Upload {
  type Props = Omit<React.JSX.IntrinsicElements['input'], 'value'> & {
    value?: File[]
    onChangeValue?: (value: File[]) => any
    multiple?: boolean
    max?: number
    trigger?: React.ReactNode
    fileRender?: (file: File) => React.ReactNode
  }
}

function Upload(
  {
    style, className,
    value: propsValue,
    onChangeValue,
    multiple,
    max,
    trigger,
    fileRender,
    ...props
  }: Upload.Props
) {
  const [el, ref] = useComponentRef(props.ref)
  const [value, setValue] = useStateListner(propsValue as File[], onChangeValue, [])

  useEffect(() => {
    if (el.current) {
      const dataTransfer = new DataTransfer()
      for (let i = 0; i < value.length; i++) {
        dataTransfer.items.add(value[i])
      }
      el.current.files = dataTransfer.files
    }
  }, [value])

  const onChangeFile = (files: FileList | null) => {
    if (!files?.length) {
      return
    }
    if (multiple) {
      setValue([...value, ...files].slice(0, max))
    } else {
      setValue([files[0]])
    }
  }

  return (
    <label
      className={cls('ui-input ui-upload', className)}
      style={style}
      onClick={(e) => {
        if (e.target !== el.current) {
          e.preventDefault()
        }
      }}
    >
      <input
        {...props}
        type='file'
        multiple={multiple}
        onChange={(e) => {
          props.onChange?.(e)
          onChangeFile(e.target.files)
        }}
        ref={ref}
      />
      <div className='ui-upload-trigger' onClick={(e) => e.stopPropagation()}>
        {trigger || (
          <Button className='ui-upload-button' disabled={props.disabled}>
            <Icon>upload</Icon>
            <span>Upload</span>
          </Button>
        )}
      </div>
      {!!value.length && (
        <div className='ui-upload-list' onClick={(e) => e.preventDefault()}>
          {value.map((file, i) => (
            <React.Fragment key={i}>
              {fileRender ? (
                fileRender(file)
              ) : (
                <div className='ui-upload-item'>
                  <span>{file.name}</span>
                  <Icon
                    className='ui-input-icon'
                    size={16}
                    onClick={() => setValue(value.filter((x) => x !== file))}
                  >
                    close
                  </Icon>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </label>
  )
}

export default Upload
