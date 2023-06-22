import {
  Amount,
  Category,
  CategoryName,
  Container,
  Date,
  Footer,
  Icon,
  Title,
} from './styled';

interface Props {
  data: {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
  };
}

export function TransactionCard({ data }: Props) {
  return (
    <Container>
      <Title>{data.name}</Title>
      <Amount type={data.type}>
        {data.type === 'negative' && '- '}
        {data.amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={data.category.icon} />
          <CategoryName>{data.category.name}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
