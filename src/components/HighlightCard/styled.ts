import { Feather } from '@expo/vector-icons';
import { ScrollViewProps } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { HighlightCardProps } from '.';
import { css } from 'styled-components';

export const Container = styled.View<Partial<HighlightCardProps>>`
  background-color: ${({ theme, type }: any) =>
    type === 'total' ? theme.colors.secondary : theme.colors.shape};

  width: ${RFValue(250)}px;
  border-radius: 10px;
  padding: 19px 23px ${RFValue(30)}px;

  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text<Partial<HighlightCardProps>>`
  font-family: ${({ theme }: any) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme, type }: any) =>
    type === 'total' ? theme.colors.shape : theme.colors.text_dark};
`;

export const Icon = styled(Feather)<Partial<HighlightCardProps>>`
  font-size: ${RFValue(30)}px;
  ${({ type }: any) =>
    type === 'up' &&
    css`
      color: ${({ theme }) => theme.colors.success};
    `}
  ${({ type }: any) =>
    type === 'down' &&
    css`
      color: ${({ theme }) => theme.colors.attention};
    `}
    ${({ type }: any) =>
    type === 'total' &&
    css`
      color: ${({ theme }) => theme.colors.shape};
    `}
`;

export const Footer = styled.View``;

export const Amount = styled.Text<Partial<HighlightCardProps>>`
  font-family: ${({ theme }: any) => theme.fonts.medium};
  font-size: ${RFValue(30)}px;
  color: ${({ theme, type }: any) =>
    type === 'total' ? theme.colors.shape : theme.colors.text_dark};
  margin-top: 38px;
`;

export const LastTransaction = styled.Text<Partial<HighlightCardProps>>`
  font-family: ${({ theme }: any) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme, type }: any) =>
    type === 'total' ? theme.colors.shape : theme.colors.text};
`;

export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 24,
  },
})`
  width: 100%;
  position: absolute;
  margin-top: ${RFPercentage(22)}px;
`;
