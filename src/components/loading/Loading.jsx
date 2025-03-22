import React from 'react'
import { Box, Spinner, Text, Center } from '@chakra-ui/react'

export const LoadingScreen = () => {
  return (
    <Box width={"100%"} display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner />
    </Box>
  )
}
