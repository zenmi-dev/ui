import Container from './Container'
import Example from './Example'
import Api from './Api'

declare namespace Component {
  type Props = {
    title: string
    examples: Example.Props['examples']
    apiItems: Api.Props['items']
  }
}

function Component(
  {
    title,
    examples,
    apiItems
  }: Component.Props
) {
  return (
    <Container>
      <h1>{title}</h1>
      <Example examples={examples} />
      <br />
      <Api items={apiItems} />
    </Container>
  )
}

export default Component
