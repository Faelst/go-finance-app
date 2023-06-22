import { Button, Container, Icon, Title } from './styles';
import { RectButtonProps } from 'react-native-gesture-handler';

export interface Props extends RectButtonProps {
  title: string;
  type: `up` | 'down';
  isActive?: boolean;
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
};

export function TransactionButton({ title, type, isActive, ...rest }: Props) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icon[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
}
