import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard';
import {
  ChartContainer,
  Container,
  Content,
  Header,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectButtonIcon,
  Title,
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { categories } from '../../utils/categories';
import { convertToCurrency } from '../../utils/convertToCurrency';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LoadContainer } from './styles';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

export function Resume() {
  const { user } = useAuth();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState([]);
  const collectionKey = '@goFinance:transactions';

  const handleChangeData = (action: 'next' | 'previus') => {
    setIsLoading(true);

    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    } else {
      const newDate = addMonths(selectedDate, -1);
      setSelectedDate(newDate);
    }
  };

  const loadData = async () => {
    const response = await AsyncStorage.getItem(
      `${collectionKey}:user_id:${user.id}`
    );
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (transaction: any) =>
        transaction.type === 'negative' &&
        new Date(transaction.createdAt).getMonth() ===
          new Date(selectedDate).getMonth() &&
        new Date(transaction.createdAt).getFullYear() ===
          new Date(selectedDate).getFullYear()
    );

    const expensiveTotal = expensives.reduce((acc: any, crr: any) => {
      return acc + Number(crr.amount);
    }, 0);

    const totalByCategory: any = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: any) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          total: convertToCurrency(categorySum),
          totalNumber: Number(categorySum),
          color: category.color,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme?.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          contentContainerStyle={{
            padding: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeData('previus')}>
              <MonthSelectButtonIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeData('next')}>
              <MonthSelectButtonIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="totalNumber"
              colorScale={totalByCategories.map(({ color }) => color)}
              width={380}
              labelRadius={60}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: 'white',
                },
              }}
            />
          </ChartContainer>
          {totalByCategories.map((item: any) => {
            return (
              <HistoryCard
                key={item.name}
                amount={item.total}
                color={item.color}
                title={item.name}
              />
            );
          })}
        </Content>
      )}
    </Container>
  );
}
