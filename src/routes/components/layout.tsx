import Component from '../../common/Component'
import { Layout } from '../../../lib/components'

const Title = 'Layout'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'div',
    props: []
  },
  { name: `${Title}.Header`, wraps: 'header', props: [] },
  { name: `${Title}.Main`, wraps: 'main', props: [] },
  { name: `${Title}.Footer`, wraps: 'footer', props: [] },
  { name: `${Title}.Sider`, wraps: 'div', props: [] }
]
const Code1 = `
import { Layout } from '@zenmi/ui'

export function Example() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider>Sider</Layout.Sider>
        <Layout.Main>Main</Layout.Main>
        <Layout.Sider>Sider</Layout.Sider>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  )
}
`
const Code2 = `
import { Layout } from '@zenmi/ui'

export function Example() {
  return (
    <Layout>
      <Layout.Sider>Sider</Layout.Sider>
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Main>Main</Layout.Main>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
      <Layout.Sider>Sider</Layout.Sider>
    </Layout>
  )
}
`
function Example1() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider>Sider</Layout.Sider>
        <Layout.Main>Main</Layout.Main>
        <Layout.Sider>Sider</Layout.Sider>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  )
}
function Example2() {
  return (
    <Layout>
      <Layout.Sider>Sider</Layout.Sider>
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Main>Main</Layout.Main>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
      <Layout.Sider>Sider</Layout.Sider>
    </Layout>
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { name: 'Example 1', code: Code1, element: <Example1 />},
        { name: 'Example 2', code: Code2, element: <Example2 />}
      ]}
      apiItems={ApiItems}
    />
  )
}
