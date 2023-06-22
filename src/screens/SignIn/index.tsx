import { RFValue } from 'react-native-responsive-fontsize';
import {
  Container,
  Footer,
  FooterWrapper,
  Header,
  SignInTitle,
  Title,
  TitleWrapper,
} from './styles';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import LogoSvg from '../../../assets/logo.svg';
import GoogleSvg from '../../../assets/google.svg';
import appleSvg from '../../../assets/apple.svg';
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useTheme } from 'styled-components';

export function SignIn() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  const handleSignIn = async (type: 'GOOGLE' | 'APPLE') => {
    try {
      setIsLoading(true);
      type === 'GOOGLE' ? await signInWithGoogle() : await signInWithApple();
    } catch (error) {
      console.error(error);
      Alert.alert('Nao foi possível fazer login');
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(130)} height={RFValue(68)} />
        </TitleWrapper>

        <Title>
          Controle suas {'\n'} finanças de forma {'\n'} muito simples
        </Title>

        <SignInTitle>Faça seu login</SignInTitle>
      </Header>

      <Footer>
        {!isLoading ? (
          <FooterWrapper>
            <SignInSocialButton
              onPress={() => handleSignIn('GOOGLE')}
              svg={GoogleSvg}
              title="Acessar com Google"
            />
            {Platform.OS === 'ios' && (
              <SignInSocialButton
                onPress={() => handleSignIn('APPLE')}
                svg={appleSvg}
                title="Entrar com Apple"
              />
            )}
          </FooterWrapper>
        ) : (
          <ActivityIndicator
            color={theme?.colors.shape}
            style={{
              marginTop: 25,
            }}
          />
        )}
      </Footer>
    </Container>
  );
}
