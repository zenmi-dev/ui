import { use, useEffect, useRef, useState } from 'react'
import { AppContext } from '../App'
import { Menu } from '../../lib/components'

declare namespace Container {
  type Props = {
    children: React.ReactNode
    fullWidth?: boolean
    headingSelectors?: string
  }
}

function Container(
  {
    children,
    fullWidth = false,
    headingSelectors = 'h1, h2, h3, h4, h5, h6'
  }: Container.Props
) {
  const { rwd, windowSize, firstRender } = use(AppContext)!
  const [menus, setMenus] = useState<Menu.Props['menus']>([])
  const headingEls = useRef<Record<string, Element>>({}) 

  useEffect(() => {
    if (!headingSelectors) {
      return
    }
    const heading = document.querySelectorAll(headingSelectors)
    const menus = []
    for (let i = 0; i < heading.length; i++) {
      const text = heading[i].textContent
      if (text) {
        const key = `${heading[i].tagName}-${text}`
        menus.push({
          key,
          name: heading[i].tagName.slice(-1) > '2' ? (
            <span style={{ paddingLeft: 16 }}>{text}</span>
          ) : (
            text
          )
        })
        headingEls.current[key] = heading[i]
      }
    }
    setMenus(menus)
  }, [])

  return (
    <div className='app-container'>
      <div style={fullWidth ? {} : { maxWidth: rwd.md }}>
        {children}
      </div>
      {!firstRender && windowSize.width >= rwd.xl && headingSelectors && (
        <div>
          {!!menus?.length && (
            <>
              <div className='app-menu-title'>On This Page</div>
              <Menu
                className='app-menu'
                menus={menus}
                activeKey=''
                onChangeActiveKey={(key) => {
                  const el = headingEls.current[key]
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Container
