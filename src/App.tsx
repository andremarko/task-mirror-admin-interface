import React from 'react';
import Homepage from './pages/Homepage/Homepage';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

function App() {
  return (
  <ChakraProvider value={defaultSystem}>
        <Homepage />
  </ChakraProvider>
  );
}

export default App;
