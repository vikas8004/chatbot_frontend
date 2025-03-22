import axiosInstance from '@/axios/axiosInstance'
import { BASE_URL } from '@/constants/baseUrl'
import { setMessages } from '@/redux/slices/msgSlice'
import { setThread, setThreads } from '@/redux/slices/threadSlice'
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
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { LuPanelLeftOpen } from "react-icons/lu"
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import MarkdownViewer from './markdown/Markdown'
import { toaster } from './ui/toaster';
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { setUser } from '@/redux/slices/userSlice';
import { FaArrowUp } from "react-icons/fa6";
import { GoSquareFill } from "react-icons/go";

const ChatBot = ({ isOpen, setIsOpen }) => {
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false) // Loading state
  const chatContainerRef = useRef(null) // Reference to the chat container
  const { messages } = useSelector(state => state.messages);
  const { thread, threads } = useSelector(state => state.threads);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle sending user input to backend
  const handleSubmit = async () => {
    if (userInput.trim() === "") return;

    setLoading(true); // Start loading

    try {
      let threadId = null;
      if (thread === "") {
        threadId = uuidv4();
        dispatch(setThread(threadId));
      }

      // Create a new messages array by spreading the existing messages
      const updatedMessages = [
        ...messages,
        { content: userInput, role: "user", thread_id: thread || threadId },
      ];

      dispatch(setMessages(updatedMessages)); // ✅ Redux receives a serializable array

      // Prepare user data for API request
      let userData = {
        content: userInput,
        thread_id: thread || threadId,
        role: "user",
      };

      // Call API for AI response
      const response = await axiosInstance.post(`${BASE_URL}/generate`, userData, {
        headers: {
          "Authorization": user.access_token
        }
      });

      if (response.status === 200) {
        // Append AI response in a serializable way
        console.log(response.data);
        if (response.data.thread) {
          const assistantMessage = response.data.message;
          dispatch(setMessages([...updatedMessages, assistantMessage]));
          dispatch(setThreads([...threads, response.data.thread]));
        }
        else {
          const assistantMessage = response.data.message;
          dispatch(setMessages([...updatedMessages, assistantMessage])); // ✅ Plain array
        }


      } else {
        throw new Error("No response from AI");
      }

      setUserInput(""); // Clear input field
    } catch (error) {
      console.error(error);
      toaster.create({
        description: "Something went wrong.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };



  // logout user
  const logoutUser = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/user/logout`, {
        headers: {
          "Authorization": user.access_token
        }
      })
      if (response.status === 200) {
        dispatch(setUser(null));
        navigate("/auth");

      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // Scroll to the bottom of the chat container whenever chatHistory changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages]) // Trigger when chatHistory changes


  return (
    <Container

      width={"100%"}
      height='100vh' // Full screen height
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems={"center"}
      pt={'10px'}
      border={"1px solid #303030"}
    >
      {/* top navbar */}
      <HStack py={2} color="white" justifyContent={"space-between"} width={"100%"}>
        <Flex alignItems="center" direction={"row"} justifyContent={"center"}>
          {
            !isOpen && <IconButton
              aria-label="Toggle Sidebar"
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              color="white"
              _hover={{
                bg: "transparent"
              }}
            >
              <LuPanelLeftOpen />
            </IconButton>
          }
          {
            !isOpen && <IconButton
              bgColor={"transparent"}
              color={"white"}
              size="md"
              onClick={() => {
                dispatch(setThread(uuidv4()));
                dispatch(setMessages([]));
              }}
            >
              <FaRegEdit />
            </IconButton>
          }
          <Text cursor={'pointer'} color={"#a9a9a9"} fontWeight={"bolder"}>GyaniBaba</Text>
          <Spacer />
        </Flex>

        <Menu.Root >
          <Menu.Trigger asChild>
            <Button bg={"transparent"} _hover={{ bg: "transparent" }} _active={{ bg: "transparent" }}>
              <Avatar.Root>
                <Avatar.Fallback name={user.fullname} />
              </Avatar.Root>
            </Button>

          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content >
                <Menu.Item value="new-txt" cursor={"pointer"} _hover={{ bg: "transparent" }} onClick={logoutUser}><MdOutlineLogout /> Logout</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

      </HStack>


      <Box
        w={{ base: '100%', sm: '90%', md: '80%', lg: '80%' }}
        overflow='hidden'
        height='100%' // Full height of the container
        display='flex'
        flexDirection='column'

      >
        <VStack
          spacing={4}
          align='stretch'
          w='100%'
          flexGrow={1}
          overflow='hidden'
        >
          <Box
            w='100%'
            overflowY='scroll'
            flexGrow={1}
            color='#e2e2e2'
            ref={chatContainerRef} // Attach the ref here
            css={{
              '&::-webkit-scrollbar': {
                display: 'none' // Hide the scrollbar for WebKit browsers
              },
              scrollbarWidth: 'none' // For Firefox
            }}

          >
            {messages.map((chat, index) => (
              <Box
                key={index}
                display='flex'
                justifyContent={
                  chat.role === 'user' ? 'flex-end' : 'flex-start'
                }
                alignItems='center'
                mb={2}
                width={'100%'}
              >
                <Box
                  p={3}
                  borderRadius='20px'
                  color='white'
                  maxWidth={chat.role === "user" ? ["80%", "70%", "60%"] : "100%"}
                  // boxShadow='xs' // Softer shadow for the messages
                  wordWrap
                  overflow='hidden'
                  bg={chat.role === 'user' ? '#303030' : 'gray.transparent'}
                >
                  <Text >
                    {chat.role === 'user' ? (
                      chat.content
                    ) : (
                      <MarkdownViewer markdownContent={chat.content} />
                    )}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} w="100%" alignItems="flex-end">
            <Box position="relative" w="100%">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !loading && userInput.trim() !== "") {
                    e.preventDefault(); // Prevents newline from being added
                    handleSubmit();
                  }
                }}
                placeholder="Ask anything..."
                size="lg"
                rounded="20px"
                disabled={loading}
                border="none"
                bg="#303030"
                color="white"
                pr="50px" // Add right padding to avoid overlap with the button
                maxH="150px"
                overflowY="auto" // Enable scrolling when needed
                _focus={{
                  border: "none",
                  outline: "none",
                }}
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none", // Hide scrollbar for WebKit browsers
                  },
                  scrollbarWidth: "none", // Hide scrollbar for Firefox
                }}
                resize="none" // Prevents manual resizing
                outline="none"
              />
              <Button
                onClick={handleSubmit}
                size="sm"
                _loading={{
                  color: "white"
                }}
                disabled={loading || userInput.trim() === ""}
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
                position="absolute"
                right="0px"
                bottom="15px"
                zIndex="1"
                bg={"transparent"}
              >
                <Box bg={"#ffffff"} p="3" rounded={"full"}>
                  {
                    loading ? <GoSquareFill /> : <FaArrowUp />
                  }
                </Box>
              </Button>
            </Box>
          </Stack>

        </VStack>
      </Box>
    </Container>
  )
}

export default ChatBot
