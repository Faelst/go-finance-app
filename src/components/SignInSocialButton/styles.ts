import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  height: ${RFValue(46)}px;
  background-color: ${({ theme }: any) => theme.colors.shape};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const ImagemContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;

  padding: ${RFValue(16)}px;
  background-color: ${({ theme }: any) => theme.colors.background};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right-width: 1px;
`;

export const Text = styled.Text`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }: any) => theme.fonts.medium};
  font-size: ${RFValue(12)}px;
`;
