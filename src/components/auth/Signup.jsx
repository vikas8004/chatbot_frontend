import { Field as ChakraField, VStack, Input, Button, Text } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../axios/axiosInstance";
import { toaster } from "../ui/toaster";

const SignUp = ({ setValue }) => {
    const signUpSchema = Yup.object().shape({
        fullname: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Required"),
        phone: Yup.string() // Changed 'number' to 'phone'
            .matches(/^[0-9]{10}$/, "Invalid phone number")
            .required("Required"),
    });

    const handleSignUpSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setSubmitting(true);
            // console.log("Signup Values:", values);
            let data = await axiosInstance.post("/user/signup", values);
            if (data.status === 201) {
                // console.log(data.data);
                toaster.create({
                    description: "User created successfully",
                    status: "success",
                    duration: 3000,
                    type: "success"
                });
                resetForm();
                setValue("second");
            }
        } catch (error) {
            console.error(error);
            toaster.create({
                description: error.response.data.detail.msg,
                status: "error",
                duration: 3000,
                type: "error"
            })
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ fullname: "", email: "", password: "", phone: "" }} // Changed 'number' to 'phone'
            validationSchema={signUpSchema}
            onSubmit={handleSignUpSubmit}
        >
            {({ isSubmitting, errors, touched }) => {
                // console.log(isSubmitting);
                return (
                    <Form>
                        <VStack gap="3" width="full">
                            <ChakraField.Root invalid={!!errors.fullname && touched.fullname}>
                                <ChakraField.Label>
                                    Full Name
                                </ChakraField.Label>
                                <Field as={Input} placeholder="Enter your full name" variant="outline" type="text" name="fullname" />
                                {errors.fullname && touched.fullname && <Text color="red.500" fontSize="sm">{errors.fullname}</Text>}
                            </ChakraField.Root>

                            <ChakraField.Root invalid={!!errors.email && touched.email}>
                                <ChakraField.Label>
                                    Email
                                </ChakraField.Label>
                                <Field as={Input} placeholder="me@example.com" variant="outline" type="email" name="email" />
                                {errors.email && touched.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                            </ChakraField.Root>

                            <ChakraField.Root invalid={!!errors.phone && touched.phone}> {/* Changed 'number' to 'phone' */}
                                <ChakraField.Label>
                                    Phone Number
                                </ChakraField.Label>
                                <Field as={Input} placeholder="Enter phone number" variant="outline" type="tel" name="phone" /> {/* Changed 'number' to 'phone' */}
                                {errors.phone && touched.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>} {/* Changed 'number' to 'phone' */}
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
                                Sign Up
                            </Button>
                        </VStack>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default SignUp;