import { useState } from 'react';
import { Button } from '../../components/Forms/Button';
import { TransactionButton } from '../../components/Forms/TransactionButton';
import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionsTypes,
} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategorySelectButton } from '../../components/CategorySelectButton';
import { Alert, Modal } from 'react-native';
import { Category, CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Forms/InputForm';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

type TransactionType = 'positive' | `negative`;

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome e obrigadotorio'),
  amount: Yup.number()
    .required('Valor Obrigatorio')
    .positive('Valor deve ser positivo')
    .typeError('Informe o valor corretamente'),
});

const collectionKey = '@goFinance:transactions';

export function Register() {
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState<TransactionType | ''>(
    ''
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState<Category>({
    key: 'category',
    name: 'Categoria',
    icon: 'any',
  });

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleTransactionType = (type: TransactionType) => {
    setTransactionType(type);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handleRegister = async (formData: FormData) => {
    if (!transactionType) {
      return Alert.alert('selecione o tipo da transacao');
    }

    if (!category.key) {
      return Alert.alert('selecione a categoria');
    }

    const data = {
      id: uuid.v4(),
      name: formData.name,
      amount: `${formData.amount}`,
      type: transactionType,
      category: category.key,
      createdAt: new Date(),
    };

    try {
      let transactionOnSave = JSON.parse(
        (await AsyncStorage.getItem(
          `${collectionKey}:user_id:${user.id}`
        )) as string
      );

      const currentData = transactionOnSave ? transactionOnSave : [];

      const dataFormatted = JSON.stringify([...currentData, data]);

      await AsyncStorage.setItem(
        `${collectionKey}:user_id:${user.id}`,
        dataFormatted
      );

      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      reset();

      navigation.navigate('Listagem');
    } catch (error) {
      Alert.alert('Nao foi possível salvar');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            placeholder="Nome"
            name="name"
            control={control}
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />

          <InputForm
            placeholder="Valor"
            name="amount"
            control={control}
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
          />

          <TransactionsTypes>
            <TransactionButton
              title="Income"
              type="up"
              onPress={() => handleTransactionType('positive')}
              isActive={transactionType === 'positive'}
            />
            <TransactionButton
              title="Outcome"
              type="down"
              onPress={() => handleTransactionType('negative')}
              isActive={transactionType === 'negative'}
            />
          </TransactionsTypes>
          <CategorySelectButton
            title={category.name}
            onPress={handleOpenCategoryModal}
          />
        </Fields>
        <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          closeSelectCategory={handleCloseCategoryModal}
          setCategory={setCategory}
        />
      </Modal>
    </Container>
  );
}
