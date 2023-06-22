import { Amount, Container, Title } from './styles';

export interface HistoryProps {
  color: string;
  title: string;
  amount: string;
}

export function HistoryCard({ color, title, amount }: HistoryProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}
