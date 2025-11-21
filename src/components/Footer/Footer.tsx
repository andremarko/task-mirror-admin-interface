import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function Footer(props:any) {
  return (
    <Box as="footer" backgroundColor='#548aff' {...props}>
        <Flex align={'center'} justify={'center'} height='60px'>
        </Flex>
    </Box>
  )
}
