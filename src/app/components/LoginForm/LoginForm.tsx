"use client"
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import Swal from 'sweetalert2';


export const LoginForm = () => {
    const router = useRouter();
    const provider = new GoogleAuthProvider();

    const [inputeStates, setInputStates] = useState({
        email: {
            isFocused: false,
            value: '',
        },
        password: {
            isFocused: false,
            value: '',
        },
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Please enter a valid email address')
                .required('Required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Required')
        }),
        onSubmit: async (values) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;
                if (user) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Signed in successfully"
                    });
                    router.push("/products/all");
                }
            } catch (error) {
                console.error("Login error", error);
            }
        },
    });

    const handleGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                router.push("/products/all")
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleFocus = (name: string) => {
        setInputStates((prevState) => ({
            ...prevState,
            [name]: { ...prevState[name as keyof typeof inputeStates], isFocused: true },
        }));
    };

    const handleBlur = (name: string) => {
        setInputStates((prevState) => ({
            ...prevState,
            [name]: { ...prevState[name as keyof typeof inputeStates], isFocused: false },
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        formik.handleChange(e);
        setInputStates((prevState) => ({
            ...prevState,
            [name]: { ...prevState[name as keyof typeof inputeStates], value },
        }));
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    sx={{
                        width: "100%",
                        marginBottom: "16px"
                    }}
                    variant="outlined"
                    label="Email Address *"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    onFocus={() => handleFocus("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    sx={{
                        width: "100%",
                        marginBottom: "16px"
                    }}
                    autoComplete="on"
                    variant="outlined"
                    label="Password *"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <div
                    className="w-[45%] bg-[#C1C1C1] py-[8px] px-[6px] text-white rounded-[5px] cursor-pointer mb-[23px] mt-[2px]"
                    onClick={handleGoogle}
                >
                    <div className="flex items-center gap-[5px] justify-center">
                        <div className="text-[16px] font-[600]">
                            Log in with
                        </div>
                        <div className="text-[18px]">
                            <FcGoogle />
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        marginBottom: "20px",
                        padding: "10px"
                    }}
                >
                    Log In
                </Button>
                <Link
                    href={"/register"}
                    className="flex justify-center underline-custom text-[#1976D2] cursor-pointer"
                >
                    Create a new account!
                </Link>
            </form>
        </>
    );
}