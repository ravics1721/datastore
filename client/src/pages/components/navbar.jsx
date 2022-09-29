import React from 'react';
import {Flex, Text, Button} from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Flex py='2' bg="cyan.600" position='fixed' width="full" top={0}>
        <Text ml='4' fontSize='2xl' fontWeight='semibold' >🚀User Data Store</Text>
    </Flex>
  )
}

export default Navbar;