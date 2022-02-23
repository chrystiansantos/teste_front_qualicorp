import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    bgColor: {
      100: '#171a88'
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  styles: {
    global: {
      body: {
        bg: '#fff',
        color: '#212529',
      },
    },
  },
});