import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(RectButton)`
  width: 100%;
  background-color: ${({ theme }: any) => theme.colors.secondary};
  border-radius: 10px;
  padding: 18px;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }: any) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }: any) => theme.colors.shape};
`;
