import { useEffect, useState } from 'react'
import { cls } from '../../../utils/index.js'

declare namespace Icon {
  type Props = React.JSX.IntrinsicElements['span'] & {
    source?: string
    size?: number
  }
}

let Loaded = false

function Icon(
  {
    source = 'Material Symbols Rounded',
    size = 20,
    ...props
  }: Icon.Props
) {
  const [loaded, setLoaded] = useState(Loaded)

  useEffect(() => {
    const href = 'https://fonts.googleapis.com/icon?family=' + source.replace(/\s/g, '+')
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  }, [source])
  useEffect(() => {
    function checkLoaded() {
      if (Loaded) {
        setLoaded(true)
        return
      }
      document.fonts.ready.then((fontFaceSet) => {
        const font = [...fontFaceSet].find((el) => el.family === source)
        if (font?.status === 'loaded') {
          setLoaded(true)
          Loaded = true
        } else {
          window.setTimeout(checkLoaded)
        }
      })
    }
    if (props.children) {
      checkLoaded()
    }
  }, [props.children])

  return (
    <span
      {...props}
      className={cls('ui-icon', props.className)}
      style={props.style}
      translate='no'
    >
      <span
        className={source.replace(/\s/g, '-').toLowerCase()}
        style={loaded ? {
          fontSize: size
        } : {
          width: size,
          height: size,
          overflow: 'hidden',
          visibility: 'hidden',
          ...props.style
        }}
      >
        {props.children}
      </span>
    </span>
  )
}

export default Icon
