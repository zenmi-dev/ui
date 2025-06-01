import React, { use, useEffect, useState } from 'react'
import { useRouter } from '../../lib/router'
import { AppContext } from '../App'
import { Drawer, Icon, Layout, Menu } from '../../lib/components'
import { useDocumentTitle } from '../../lib/hooks'
import GithubSVG from '../assets/github.svg'
import GithubWhiteSVG from '../assets/github-white.svg'

const Name = 'Zenmi UI'
const Repo = 'https://github.com/zenmis/@zenmi/ui'
const HeaderMenus = [
  { key: '/docs/installation', name: 'Docs' },
  { key: '/components/button', name: 'Components' },
  { key: '/router', name: 'Router' },
  { key: '/hooks', name: 'Hooks' },
  { key: '/utils', name: 'Utils' }
]
const SiderMenus = [
  {
    name: 'Getting Started',
    prefix: '/docs',
    children: [
      { key: '/installation', name: 'Installation' },
      { key: '/dark-mode', name: 'Dark Mode' }
    ]
  },
  {
    name: 'Components',
    prefix: '/components',
    children: [
      { key: '/button', name: 'Button' },
      { key: '/calendar', name: 'Calendar' },
      { key: '/card', name: 'Card' },
      { key: '/carousel', name: 'Carousel' },
      { key: '/collapse', name: 'Collapse' },
      { key: '/context-menu', name: 'ContextMenu' },
      { key: '/dialog', name: 'Dialog' },
      { key: '/divider', name: 'Divider' },
      { key: '/drawer', name: 'Drawer' },
      { key: '/dropdown', name: 'Dropdown' },
      { key: '/icon', name: 'Icon' },
      { key: '/layout', name: 'Layout' },
      { key: '/message', name: 'Message' },
      { key: '/menu', name: 'Menu' },
      { key: '/overlay', name: 'Overlay' },
      { key: '/pagination', name: 'Pagination' },
      { key: '/popover', name: 'Popover' },
      { key: '/table', name: 'Table' },
      { key: '/tabs', name: 'Tabs' },
      { key: '/toast', name: 'Toast' }
    ]
  },
  {
    name: 'Form Input',
    prefix: '/components',
    children: [
      { key: '/input', name: 'Input' },
      { key: '/textarea', name: 'Textarea' },
      { key: '/radio', name: 'Radio' },
      { key: '/checkbox', name: 'Checkbox' },
      { key: '/switch', name: 'Switch' },
      { key: '/slider', name: 'Slider' },
      { key: '/select', name: 'Select' },
      { key: '/date-picker', name: 'DatePicker' },
      { key: '/color-picker', name: 'ColorPicker' },
      { key: '/upload', name: 'Upload' }
    ]
  },
  {
    name: 'Others',
    prefix: '',
    children: [
      { key: '/router', name: 'Router' },
      { key: '/hooks', name: 'Hooks' },
      { key: '/utils', name: 'Utils' }
    ]
  }
]

function Home(props: React.PropsWithChildren) {
  const { rwd, windowSize, firstRender, mode } = use(AppContext)!
  const { pathname, navigate } = useRouter()!
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/' || !props.children) {
      navigate('/docs/installation')
    } else if (['/docs/installation', '/components/button'].includes(pathname)) {
      const el = document.querySelector<HTMLElement>('.app-sider')
      el?.scrollTo({ behavior: 'smooth', top: 0 })
    } else if (['/router', '/hooks', '/utils'].includes(pathname)) {
      const el = document.querySelector<HTMLElement>('.app-sider')
      el?.scrollTo({ behavior: 'smooth', top: el.offsetHeight })
    }
  }, [pathname])
  useEffect(() => {
    for (let i = 0; i < SiderMenus.length; i++) {
      const { prefix, children } = SiderMenus[i]
      const menu = children.find((x) => prefix + x.key === pathname)
      if (menu) {
        const els = document.querySelectorAll('.app-sider .ui-menu-item')
        for (let i = 0; i < els.length; i++) {
          if (els[i].textContent === menu?.name) {
            els[i].scrollIntoView({ behavior: 'instant', block: 'center' })
            break
          }
        }
      }
    }
  }, [])

  useDocumentTitle((() => {
    for (let i = 0; i < SiderMenus.length; i++) {
      const { prefix, children } = SiderMenus[i]
      const menu = children.find((x) => prefix + x.key === pathname)
      if (menu) {
        return `${Name} - ${menu.name}`
      }
    }
    return ''
  })())

  const HeaderMenu = (
    <Menu
      className='app-menu'
      type={menuOpen ? 'vertical' : 'horizontal'}
      menus={menuOpen ? [{ key: '/', name: 'Home' }, ...HeaderMenus] : HeaderMenus}
      activeKey={pathname}
      onChangeActiveKey={(key) => {
        navigate(key)
        setMenuOpen(false)
      }}
    />
  )
  const SiderMenu = (
    SiderMenus.map((menu) => (
      <React.Fragment key={menu.name}>
        <div className='app-menu-title'>{menu.name}</div>
        <Menu
          className='app-menu'
          menus={menu.children}
          activeKey={pathname.replace(new RegExp(`^${menu.prefix}`), '')}
          onChangeActiveKey={(key) => {
            navigate(menu.prefix + key)
            setMenuOpen(false)
          }}
        />
      </React.Fragment>
    ))
  )
  return (
    <Layout>
      <Layout.Header className='app-header'>
        <div>
          {windowSize.width >= rwd.md ? (
            <>
              <a className='app-home' href='/' translate='no'>{Name}</a>
              {HeaderMenu}
            </>
          ) : (
            <Icon className='app-header-icon' onClick={() => setMenuOpen(true)}>Menu</Icon>
          )}
          <Drawer
            className='app-drawer'
            style={{ height: '80vh' }}
            open={menuOpen}
            onChangeOpen={setMenuOpen}
            position='bottom'
          >
            <Drawer.Content>
              {HeaderMenu}
              {SiderMenu}
            </Drawer.Content>
          </Drawer>
        </div>
        <div>
          <a href={Repo} target='_blank' className='app-header-icon'>
            <img src={mode.state === 'dark' ? GithubWhiteSVG : GithubSVG} />
          </a>
          <Icon className='app-header-icon' onClick={mode.toggle}>
            {mode.state === 'dark' ? 'light_mode' : 'dark_mode'}
          </Icon>
        </div>
      </Layout.Header>
      <Layout>
        {!firstRender && windowSize.width >= rwd.md && (
          <Layout.Sider className='app-sider'>{SiderMenu}</Layout.Sider>
        )}
        <Layout.Main>{props.children}</Layout.Main>
      </Layout>
    </Layout>
  )
}

export default Home
