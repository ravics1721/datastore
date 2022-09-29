import React from "react";
import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const Form = ({ isUpdate = false, user , onSubmit}) => {


  return (
    <Box px="5" py="4" rounded="md">
      <FormControl>
        <FormLabel>User</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input type="text" />
      </FormControl>
    </Box>
  );
};

export default Form;
