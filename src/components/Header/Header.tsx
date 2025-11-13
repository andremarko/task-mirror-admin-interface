import { Box, Button, CardHeader, Flex } from '@chakra-ui/react'
import React from 'react'

export default function Header() {
  return (
    <Box as="header" backgroundColor='gray.300'>
        <Flex align={'flex-start'}>
            <Button backgroundColor={'transparent'} _hover={{bg: "gray.200"}}>Usuarios</Button>
            <Button backgroundColor={'transparent'} _hover={{bg: "gray.200"}}>Tarefas</Button>
        </Flex>
    </Box>
  )
}
