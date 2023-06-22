import {
  Category,
  CategoryList,
  Container,
  Footer,
  Header,
  Icon,
  Name,
  Separator,
  Title,
} from './styles';
import { categories } from '../../utils/categories';
import { Button } from '../../components/Forms/Button';

export interface Category {
  key: string;
  name: string;
  icon?: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  closeSelectCategory,
  setCategory,
}: Props) {
  const handleCategorySelect = (category: Category) => {
    setCategory(category);
  };

  return (
    <Container>
      <Header>
        <Title>Categorias</Title>
      </Header>

      <CategoryList
        data={categories}
        keyExtractor={(item: any) => item.key}
        renderItem={({ item }: any) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={<Separator />}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
}
