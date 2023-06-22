export const convertToCurrency = (value: string | number) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
