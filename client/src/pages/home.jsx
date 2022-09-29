import React, { useState, useMemo, useCallback } from "react";
import Navbar from "./components/navbar";
import { getUsers, createNewUser, updateUser } from "./services/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Thead, Tbody, Box, Tr, Container } from "@chakra-ui/react";
import { Th, Td, TableCaption, TableContainer, Flex } from "@chakra-ui/react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { ModalHeader, useDisclosure, useToast } from "@chakra-ui/react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Button, Checkbox } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

let range = new Array(10).fill(1);

const Home = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userData, setUserData] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setUserData({});
      setSelectedId(null);
    },
  });

  const pageNumber = useMemo(() => {
    return Number(searchParams.get("page")) || 1;
  }, [searchParams]);
  const queryClient = useQueryClient();
  const { isLoading, data, isError, error, refetch } = useQuery(
    ["users"],
    getUsers(pageNumber)
  );
  const createMutation = useMutation(createNewUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({
        title: "Success",
        description: "Add new user",
        status: "success",
      });
      onClose();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message,
        status: "error",
      });
    },
  });
  const handlePagination = useCallback(
    (page) => {
      let query = {
        page: page,
      };
      setSearchParams(query);
      refetch(page);
    },
    [searchParams]
  );
  const updateMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({
        title: "Success",
        description: "Updated user successfully",
        status: "success",
      });
      onClose();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message,
        status: "error",
      });
    },
  });
  const handleRowClick = (user) => {
    setSelectedId(user);
    setUserData({
      user: user.user,
      name: user.name,
    });
    onOpen();
  };

  const saveUser = () => {
    if (selectedId) {
      console.log("Updating new user...");
      updateMutation.mutate({ id: selectedId._id, user: userData });
    } else {
      console.log("Creating new user..");
      createMutation.mutate(userData);
    }
  };

  const handleChange = (e, type) => {
    if (type === "name") {
      setUserData((prev) => {
        return {
          ...prev,
          name: e.target.value,
        };
      });
    }
    if (type === "user") {
      setUserData((prev) => {
        return {
          ...prev,
          user: e.target.value,
        };
      });
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxW="container.lg" my="16">
        {isLoading && <div>Loading🚀..</div>}
        {isError && <Box color="red">{error?.message}</Box>}
        <Flex justify="end" my="5">
          <Button onClick={onOpen} colorScheme="cyan" variant="outline">
            New
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box px="5" py="4" rounded="md">
                  <FormControl>
                    <FormLabel>User</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => handleChange(e, "user")}
                      value={userData?.user || ""}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => handleChange(e, "name")}
                      value={userData?.name || ""}
                    />
                  </FormControl>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                  onClick={saveUser}
                  colorScheme="cyan"
                >
                  {selectedId ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
        {data && (
          <TableContainer border="1px" height="md" overflowY="scroll">
            <Table size="sm" variant="striped">
              {/* <TableCaption>Add pagination</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Name</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Changes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.users?.map((user) => {
                  return (
                    <Tr
                      key={user._id}
                      onClick={() => {
                        handleRowClick(user);
                      }}
                    >
                      <Td>{user.user}</Td>
                      <Td>{user.name}</Td>
                      <Td>{moment(user.date).format("DD/MM/YYYY hh:mm")}</Td>
                      <Td isNumeric>{user.changes}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        <Flex py="1" mb="2" justify="center">
          {range.map((item, index) => {
            return (
              <Button
                key={index + item}
                colorScheme="cyan"
                size="sm"
                mx="1"
                variant={pageNumber === index + item ? "solid" : "outline"}
                onClick={() => handlePagination(index + item)}
              >
                {" "}
                {index + item}{" "}
              </Button>
            );
          })}
        </Flex>
      </Container>
    </div>
  );
};

export default Home;
