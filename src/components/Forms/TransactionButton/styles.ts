import styled, { css } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

type TransactionType = 'up' | `down`;

interface IconsProps {
  type: TransactionType;
}

interface ContainerProps {
  isActive: boolean;
  type: TransactionType;
}

export const Container = styled.View<ContainerProps>`
  width: 48%;

  padding: 16px;

  border-width: ${({ isActive }: any) => (isActive ? 0 : 1.5)}px;
  border-color: ${({ theme }: any) => theme.colors.text};
  border-style: solid;
  border-radius: 5px;

  ${({ isActive, type }: any) =>
    isActive &&
    type === `up` &&
    css`
      background-color: ${({ theme }: any) => theme.colors.success_light};
    `}

  ${({ isActive, type }: any) =>
    isActive &&
    type === `down` &&
    css`
      background-color: ${({ theme }: any) => theme.colors.attention_light};
    `}
`;

export const Icon = styled(Feather)<IconsProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;

  color: ${({ theme, type }: any) =>
    type === 'up' ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }: any) => theme.fonts.regular};
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
