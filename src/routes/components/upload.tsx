import Component from '../../common/Component'
import { Upload } from '../../../lib/components'

const Title = 'Upload'
const ApiItems: Component.Props['apiItems'] = [
  {
    name: Title,
    wraps: 'input/file',
    props: [
      { prop: 'value', type: 'File[]' },
      { prop: 'onChangeValue', type: '(value: File[]) => any' },
      { prop: 'multiple', type: 'boolean', defaultValue: false },
      { prop: 'max', type: 'number' },
      { prop: 'trigger', type: 'React.ReactNode' },
      { prop: 'fileRender', type: '(file: File) => React.ReactNode' },
    ]
  }
]
const Code = `
import { Upload } from '@zenmi/ui'

export function Example() {
  return (
    <Upload />
  )
}
`
function Example() {
  return (
    <Upload />
  )
}

export default function ComponentDocs() {
  return (
    <Component
      title={Title}
      examples={[
        { code: Code, element: <Example />, center: true }
      ]}
      apiItems={ApiItems}
    />
  )
}
