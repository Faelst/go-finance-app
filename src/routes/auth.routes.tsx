import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'styled-components';
import { SignIn } from '../screens/SignIn';

const { Navigator, Screen } = createStackNavigator();

export function AuthRoutes() {
  const theme = useTheme();

  return (
    <Navigator headerMode="none">
      <Screen name="SignIn" component={SignIn} />
    </Navigator>
  );
}
