import axiosInstance from "@/axios/axiosInstance";
import { BASE_URL } from "@/constants/baseUrl";
import { setMessageLoading, setMessages } from "@/redux/slices/msgSlice";
import { setThread, setThreadLoading, setThreads } from "@/redux/slices/threadSlice";
import { Box, Flex, HStack, IconButton, Text, useBreakpointValue, VStack, Menu, Button, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBot from "./Chatbot";

import { FaRegEdit } from "react-icons/fa";
import { LuPanelRightOpen } from "react-icons/lu";
import { v4 as uuidv4 } from 'uuid';
import { toaster } from "./ui/toaster";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [msgs, setMsgs] = useState([])
    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user } = useSelector(state => state.user);
    const { threads, threadLoading, thread } = useSelector(state => state.threads);
    const { messages } = useSelector(state => state.messages);
    const dispatch = useDispatch()
    const fetchThreads = async () => {

        try {
            setThreadLoading(true)
            const threads = await axiosInstance.get(`${import.meta.env.VITE_APP_BASE_URL}/threads`, {
                headers: {
                    "Authorization": user.access_token
                }
            })
            if (threads.status === 200) {
                // console.log(threads.data);
                dispatch(setThreads(threads.data.threads))
            }
        } catch (error) {
            console.log(error);

        }
        finally {
            setThreadLoading(false)
        }
    }
    // console.log(thread);

    // fetching messages
    const fetchMessages = async (threadId) => {
        try {
            setMessageLoading(true);
            if (isMobile) {
                setIsOpen(false)
            }
            const messages = await axiosInstance.get(`${BASE_URL}/messages/${threadId}`, {
                headers: {
                    Authorization: user.access_token
                }
            });
            // console.log("messages", messages.data);
            if (messages.status === 200) {
                dispatch(setMessages(messages.data.messages));

            }

        } catch (error) {
            console.log(error);

        }
        finally {
            setMessageLoading(false)
        }
    }
    // delete thread
    const deleteThread = async (threadId) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/threads/delete/${threadId}`, {
                headers: {
                    "Authorization": user.access_token
                }
            })
            if (response.status === 200) {
                // console.log(response.data);
                toaster.create({
                    description: response.data.message,
                    type: "success",
                    duration: 3000,
                })
                fetchThreads();
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchThreads()
    }, [])
    // console.log(threads);
    // console.log(threadLoading);


    return (
        <Flex h="100vh" >
            {/* Sidebar */}
            <Box
                w={isOpen ? ["100%", "40%", "30%", "20%"] : "0px"}
                bg="gray.900"
                color="white"
                transition="width 0.3s"
                height={"100%"}
                overflowY={"scroll"}
                css={{
                    "&::-webkit-scrollbar": {
                        display: "none", // Hide scrollbar for WebKit browsers
                    },
                    scrollbarWidth: "none", // For Firefox
                }}

            >
                <VStack align="stretch" spacing={0} px={4} pt={4} >
                    <HStack justifyContent={"space-between"} w={"100%"}>
                        <IconButton
                            color={'white'}
                            bgColor={"transparent"}
                            aria-label="Toggle Sidebar"
                            onClick={toggleSidebar}
                        >
                            <LuPanelRightOpen />
                        </IconButton>


                        <IconButton
                            bgColor={"transparent"}
                            color={"white"}
                            size="md"
                            onClick={() => {
                                dispatch(setThread(uuidv4()));
                                dispatch(setMessages([]));
                                if (isMobile) {
                                    setIsOpen(false)
                                }
                            }}
                        >
                            <FaRegEdit />
                        </IconButton>



                    </HStack>
                    {

                        threads.length ? threads.map((ele, i) => {
                            return <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={"1"} as={"span"} style={{
                                backgroundColor: thread === ele.thread_id ? "#2f2f2f" : "transparent",
                                borderRadius: "10px"
                            }} key={i} cursor={"pointer"} mb={"-10px"}>
                                <Text onClick={() => {
                                    dispatch(setThread(ele.thread_id))
                                    fetchMessages(ele.thread_id)
                                }}>{isOpen ? ele.title : null}</Text>
                                <Menu.Root >
                                    <Menu.Trigger asChild>
                                        <Button border={"none"} mt={"-5px"}
                                            outline={"none"}
                                            _active={{
                                                bg: "transparent",
                                                outline: "none",
                                                border: "none"
                                            }}
                                            _hover={{
                                                bg: "transparent",
                                                outline: "none",
                                                border: "none"
                                            }} variant="outline" size="sm">
                                            ...
                                        </Button>
                                    </Menu.Trigger>
                                    <Portal >
                                        <Menu.Positioner bg={"transparent"}>
                                            <Menu.Content border={"none"} outline={"none"} bg={"#2f2f2f"}>
                                                <Menu.Item bg={"transparent"} cursor={"pointer"}
                                                    onClick={() => { deleteThread(ele.thread_id) }}
                                                >
                                                    Delete
                                                </Menu.Item>

                                            </Menu.Content>
                                        </Menu.Positioner>
                                    </Portal>
                                </Menu.Root>
                            </Box>
                        }) : null
                    }
                </VStack>
            </Box>

            {/* Main Content */}
            <Box flex="1" width={open ? ["0px", "60%", "70%", "80"] : "100%"} display={[isOpen ? "none" : "block", "block", "block", "block"]} >
                <ChatBot msgs={msgs} isOpen={isOpen} setIsOpen={setIsOpen} fetchThreads={fetchThreads} />
            </Box>
        </Flex>
    );
};

export default Sidebar;
