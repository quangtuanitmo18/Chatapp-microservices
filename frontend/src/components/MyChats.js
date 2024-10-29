import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, Input } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import http from "../config/http";
import { debounce } from "lodash";
import io from "socket.io-client";
import { appConfig } from "../config/app";

var socket;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, fetchChats, chats, setChats } =
    ChatState();

  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearchChats = async (search) => {
    // console.log(user._id);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await http.get(
        `/api/chat?search=${search === undefined ? "" : search}`,
        config
      );
      setLoading(false);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    const isUserInChat = chat.users.findIndex((u) => u._id === user._id);
    console.log(isUserInChat);
    if (isUserInChat === -1) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await http.put(
          "/api/chat/groupadd",
          {
            chatId: chat._id,
            userId: user._id,
          },
          config
        );

        socket.emit("new user join chat", {
          sender: user,
          chat: data,
        });
        setSelectedChat(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to add user to group chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  useEffect(() => {
    socket = io(appConfig.socketUrl);
    socket.on("connected", () => {});

    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("fetchchats");
    fetchChats();
  }, []);
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    handleSearchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box d="flex" pb={2}>
        <Input
          placeholder="Search by chat name"
          mr={2}
          onChange={debounce((e) => handleSearchChats(e.target.value), 500)}
        />
        {/* <Button onClick={handleSearchChats}>Go</Button> */}
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <ChatLoading />
        ) : (
          chats && (
            <Stack overflowY="scroll">
              {chats?.map((chat) => (
                <Box
                  onClick={() => handleSelectChat(chat)}
                  cursor="pointer"
                  bg={selectedChat?._id === chat?._id ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat?._id === chat?._id ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
                </Box>
              ))}
            </Stack>
          )
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
