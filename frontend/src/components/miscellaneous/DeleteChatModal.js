import { DeleteIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  IconButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import http from "../../config/http";

const DeleteChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemoveChat = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await http.delete(
        `/api/chat/groupremove/${selectedChat._id}`,
        config
      );
      console.log(data);

      setFetchAgain(!fetchAgain);
      // fetchMessages();
      setLoading(false);

      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to delete Chat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<DeleteIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="18px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Are you sure you want to delete this chat group?
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center"></ModalBody>
          <ModalFooter d="flex" style={{ gap: "10px" }}>
            <Button onClick={() => onClose()} colorScheme="gray">
              Exit
            </Button>
            <Button onClick={() => handleRemoveChat()} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteChatModal;
