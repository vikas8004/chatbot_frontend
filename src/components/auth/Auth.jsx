import { Box, Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./Signup"
import { useNavigate } from "react-router-dom"

const Auth = ({ user }) => {
    const [value, setValue] = useState("first")
    let navigate = useNavigate();
    useEffect(() => {
        if (user?.access_token) {
            navigate("/")
        }
    }, [])

    return (
        <>
            <Box width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center">

                <Tabs.Root value={value} onValueChange={(e) => setValue(e.value)} width={["90%", "70%", "50%"]} variant={"line"} >
                    <Tabs.List textAlign={"center"}>
                        <Tabs.Trigger value="first" width={"50%"}>Sign Up</Tabs.Trigger>
                        <Tabs.Trigger value="second" width={"50%"}>Log In</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="first"><SignUp setValue={setValue} /></Tabs.Content>
                    <Tabs.Content value="second"><SignIn /></Tabs.Content>
                </Tabs.Root>
            </Box>
        </>
    )
}
export default Auth