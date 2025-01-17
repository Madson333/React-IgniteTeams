import { Container, Icon, Title } from "./styles";
import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  title: String;
}

export function GroupCard({title, ...rest}: Props){

  
  return (
    <Container {...rest} >
      <Icon />
      <Title>
        {title}
      </Title>
    </Container>
  )
}