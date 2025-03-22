import axiosInstance from '@/axios/axiosInstance';
import { BASE_URL } from '@/constants/baseUrl';
import { setMessages } from '@/redux/slices/msgSlice';
import { setThread, setThreads } from '@/redux/slices/threadSlice';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  Textarea,
  VStack,
  Menu, Portal,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { LuPanelLeftOpen } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import MarkdownViewer from './markdown/Markdown';
import { toaster } from './ui/toaster';
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/redux/slices/userSlice';
import { FaArrowUp } from "react-icons/fa6";
import { GoSquareFill } from "react-icons/go";

const ChatBot = ({ isOpen, setIsOpen, fetchThreads }) => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { messages } = useSelector(state => state.messages);
  const { thread, threads } = useSelector(state => state.threads);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (userInput.trim() === "") return;

    setLoading(true);
    let threadId = thread || uuidv4();
    if (!thread) dispatch(setThread(threadId));

    let userData = { content: userInput, thread_id: threadId, role: "user" };

    // Create a new array instead of modifying Redux state directly
    let updatedMessages = [...messages, { content: userInput, role: "user", thread_id: threadId }];
    dispatch(setMessages(updatedMessages));

    try {
      const response = await fetch(`${BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Authorization": user.access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("No response from AI");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { content: "", role: "assistant", thread_id: threadId };

      // Create a new array with a fresh assistant message
      updatedMessages = [...updatedMessages, assistantMessage];
      dispatch(setMessages(updatedMessages));

      const messageIndex = updatedMessages.length - 1;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });

        // Instead of modifying assistantMessage.content directly, create a new array
        updatedMessages = updatedMessages.map((msg, idx) =>
          idx === messageIndex ? { ...msg, content: msg.content + decodedChunk } : msg
        );

        dispatch(setMessages(updatedMessages));
      }
      fetchThreads();

    } catch (error) {
      console.error(error);
      toaster.create({ description: "Something went wrong.", type: "error", duration: 3000 });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };




  const logoutUser = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/user/logout`, {
        headers: { "Authorization": user.access_token }
      });

      if (response.status === 200) {
        dispatch(setUser(null));
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container width={"100%"} height='100vh' display='flex' flexDirection='column' justifyContent='center' alignItems={"center"} pt={'10px'} border={"1px solid #303030"}>
      <HStack py={0} color="white" justifyContent={"space-between"} width={"100%"} mb={"10px"}>
        <Flex alignItems="center" direction={"row"} justifyContent={"center"}>
          {!isOpen && (
            <IconButton aria-label="Toggle Sidebar" onClick={() => setIsOpen(!isOpen)} variant="ghost" color="white" _hover={{ bg: "transparent" }}>
              <LuPanelLeftOpen />
            </IconButton>
          )}
          {!isOpen && (
            <IconButton bgColor={"transparent"} color={"white"} size="md" onClick={() => { dispatch(setThread(uuidv4())); dispatch(setMessages([])); }}>
              <FaRegEdit />
            </IconButton>
          )}
          <Text cursor={'pointer'} color={"#a9a9a9"} fontWeight={"bolder"}>GyaniBaba</Text>
          <Spacer />
        </Flex>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button bg={"transparent"} _hover={{ bg: "transparent" }} _active={{ bg: "transparent" }}>
              <Avatar.Root size={["md"]}>
                <Avatar.Fallback name={user.fullname} />
              </Avatar.Root>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="new-txt" cursor={"pointer"} _hover={{ bg: "transparent" }} onClick={logoutUser}><MdOutlineLogout /> Logout</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <Box w={{ base: '100%', sm: '90%', md: '80%', lg: '80%' }} overflow='hidden' height='100%' display='flex' flexDirection='column'>
        <VStack spacing={4} align='stretch' w='100%' flexGrow={1} overflow='hidden'>
          <Box w='100%' overflowY='scroll' flexGrow={1} color='#e2e2e2' ref={chatContainerRef} css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
            {messages.map((chat, index) => (
              <Box key={index} display='flex' justifyContent={chat.role === 'user' ? 'flex-end' : 'flex-start'} alignItems='center' mb={2} width={'100%'}>
                <Box p={3} borderRadius='20px' color='white' maxWidth={chat.role === "user" ? ["80%", "70%", "60%"] : "100%"} bg={chat.role === 'user' ? '#303030' : 'gray.transparent'}>
                  <Text fontSize={"14px"}>{chat.role === 'user' ? chat.content : <MarkdownViewer markdownContent={chat.content} />}</Text>
                </Box>
              </Box>
            ))}
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%" alignItems="flex-end">
            <Box position="relative" w="100%">
              <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !loading && userInput.trim() !== "") { e.preventDefault(); handleSubmit(); } }} placeholder="Ask anything..." size="lg" rounded="20px" disabled={loading} border="none" bg="#303030" color="white" resize="none" outline="none" />
              <Button onClick={handleSubmit} size="sm" disabled={loading || userInput.trim() === ""} position="absolute" right="0px" bottom="15px" bg={"transparent"}>
                <Box bg={"#ffffff"} p="3" rounded={"full"}>{loading ? <GoSquareFill /> : <FaArrowUp />}</Box>
              </Button>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </Container>
  );
};

export default ChatBot;
