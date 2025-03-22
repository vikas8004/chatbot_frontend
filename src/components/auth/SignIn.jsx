import { Field as ChakraField, VStack, Input, Button, Text } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../axios/axiosInstance";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const signInSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleSignInSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // console.log("Signin Values:", values);
            let data = await axiosInstance.post("/user/signin", values);
            if (data.status === 200) {
                console.log((data.data));
                toaster.create({
                    description: data.data.msg,
                    status: "success",
                    duration: 3000,
                    type: "success"
                });
                dispatch(setUser(data.data.user));
                resetForm();
                navigate("/")


            };
        } catch (error) {
            console.log(error);
            toaster.create({
                description: error.response.data.detail.msg,
                status: "error",
                duration: 3000,
                type: "error"

            });

        }
        finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInSchema}
            onSubmit={handleSignInSubmit}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form>
                    <VStack gap="3" width="full">
                        <ChakraField.Root invalid={!!errors.email && touched.email} >
                            <ChakraField.Label>
                                Email
                            </ChakraField.Label>
                            <Field as={Input}
                                autoComplete="true"
                                placeholder="me@example.com" variant="outline" type="email" name="email" />
                            {errors.email && touched.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                        </ChakraField.Root>

                        <ChakraField.Root invalid={!!errors.password && touched.password}>
                            <ChakraField.Label>
                                Password
                            </ChakraField.Label>
                            <Field
                                as={Input}
                                placeholder="Enter password"
                                variant="outline"
                                type="password"
                                name="password"
                            />
                            {errors.password && touched.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
                        </ChakraField.Root>

                        <Button type="submit" loading={isSubmitting} colorScheme="blue">
                            Sign In
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
    );
};

export default SignIn;