import { Container, Subtitle, Title } from "./styles";

type Props = {
  title: String;
  subtitle: String;
}

export function Highlight({title, subtitle}: Props){
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  )
}