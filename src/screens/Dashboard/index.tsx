import { ActivityIndicator } from 'react-native';
import {
  Container,
  Header,
  Photo,
  PowerIcon,
  User,
  UserGreenting,
  UserInfo,
  UserName,
  UserWrapper,
  Title,
  Transactions,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import { HighlightCards } from '../../components/HighlightCard/styled';
import { TransactionCard } from '../../components/TransactionCard';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { useFocusEffect } from '@react-navigation/native';
import { convertToCurrency } from '../../utils/convertToCurrency';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

const collectionKey = '@goFinance:transactions';

export function Dashboard() {
  const { signOut, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [highlightData, setHighlightData] = useState({
    entries: {
      amount: convertToCurrency(0),
      lastTransaction: '0',
    },
    expensive: {
      amount: convertToCurrency(0),
      lastTransaction: '0',
    },
    total: {
      amount: convertToCurrency(0),
      lastTransaction: '',
    },
  });
  const theme = useTheme();

  const getLastTransactionDate = (collection: any, type: any) => {
    const collectionFiltered = collection.filter(
      (transaction: any) => transaction.type == type
    );

    if (!collectionFiltered.length) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFiltered.map((transaction: any) =>
          new Date(transaction.createdAt).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      {
        month: 'long',
      }
    )}`;
  };

  const loadTransactions = async () => {
    const dataString = await AsyncStorage.getItem(
      `${collectionKey}:user_id:${user.id}`
    );
    const transactionFormatted = dataString ? JSON.parse(dataString) : [];
    let entriesSum = 0;
    let expensiveSum = 0;

    const lastEntryTransactionDate = getLastTransactionDate(
      transactionFormatted,
      'positive'
    );
    const lastExpensiveTransactionDate = getLastTransactionDate(
      transactionFormatted,
      'negative'
    );

    setTransactions(
      transactionFormatted.map((item: any) => {
        if (item.type === 'positive') {
          entriesSum += Number(item.amount);
        } else {
          expensiveSum += Number(item.amount);
        }

        const amount = convertToCurrency(item.amount);

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(item.date);

        return {
          id: item.id,
          name: item.name,
          amount,
          date,
          type: item.type,
          category: categories.find((c) => c.key === item.category),
        };
      })
    );

    setHighlightData({
      entries: {
        amount: convertToCurrency(entriesSum),
        lastTransaction: `Ultima entrada  dia ${lastEntryTransactionDate}`,
      },
      expensive: {
        amount: convertToCurrency(expensiveSum),
        lastTransaction: `Ultima Saida  dia ${lastExpensiveTransactionDate}`,
      },
      total: {
        amount: convertToCurrency(entriesSum - expensiveSum),
        lastTransaction: '',
      },
    });

    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme?.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreenting>Ola,</UserGreenting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <PowerIcon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData.entries.amount}
              type="up"
              lastTransaction={highlightData.entries.lastTransaction}
            />

            <HighlightCard
              title="Saídas"
              amount={highlightData.expensive.amount}
              type="down"
              lastTransaction={highlightData.expensive.lastTransaction}
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              type="total"
              lastTransaction={highlightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
