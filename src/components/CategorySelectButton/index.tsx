import { Container, Icon, Title } from './styles';
import { RectButtonProps } from 'react-native-gesture-handler';

interface Props extends RectButtonProps {
  title: string;
}

export function CategorySelectButton({ title, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
      <Icon name="chevron-down" />
    </Container>
  );
}
