"use client"
import { auth, db } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export const RegisterForm = () => {

    const provider = new GoogleAuthProvider();
    const [tagLabel, setTagLabel] = useState<any>(null);

    useEffect(() => {
        setTagLabel(document.querySelector(".taglabel"));
    }, [])


    const [inputeStates, setInputStates] = useState({
        fullName: {
            isFocused: false,
            value: '',
        },
        email: {
            isFocused: false,
            value: '',
        },
        password: {
            isFocused: false,
            value: '',
        },
        confirmPassword: {
            isFocused: false,
            value: '',
        },
    })


    // xử lí kiểm tra input 
    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required('Required')
                .min(4, 'Must be 4 or more characters'),
            email: Yup.string()
                .required('Required')
                .matches(/^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Please enter a valid email address'),
            password: Yup.string()
                .required('Required')
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .required('Required')
                .oneOf([Yup.ref('password')], 'Passwords must match'),
        }),
        onSubmit: async (values) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                const user = userCredential.user;
                if (user) {
                    set(ref(db, 'users/' + user.uid), {
                        fullName: values.fullName,
                        email: values.email,
                        password: values.password,
                    });
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
                }
            } catch (error) {
                console.error("Đăng kí lỗi");
            }
        },
    });
    //

    const handleGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                set(ref(db, 'users/' + user.uid), {
                    fullName: user.displayName,
                    email: user.email,
                });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    // kiểm tra người dùng focus hay không và input có giá trị hay không để xử lí animation
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
        tagLabel?.classList.remove("text-blue-500");
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        formik.handleChange(e);
        setInputStates((prevState) => ({
            ...prevState,
            [name]: { ...prevState[name as keyof typeof inputeStates], value },
        }));
    };
    //

    return (
        <>
            <form className="" onSubmit={formik.handleSubmit}>
                {
                    (["fullName", 'email', 'password', 'confirmPassword'].map((field, index) => (
                        <div
                            className="relative"
                            key={index}
                        >
                            <input
                                className={`inputfield fullname-field w-full border py-[16px] px-[12px] outline-[#1976D2] hover:border-[black] rounded-[5px] ${formik.touched[field as keyof typeof inputeStates] && formik.errors[field as keyof typeof inputeStates] ? 'border-red-500 mb-[5px]' : 'border-[#C1C1C1] mb-[15px]'}`}
                                type={field === "fullName" ? "text" : field === "email" ? "email" : "password"}
                                name={field}
                                id={field}
                                autoComplete="off"
                                placeholder={
                                    inputeStates[field as keyof typeof inputeStates].isFocused ?
                                        (field === "fullName" ? "Enter your name" :
                                            field === "email" ? "Enter your email" :
                                                field === "password" ? "Enter your password" : "Confirm your password") : ''
                                }
                                onChange={handleChange}
                                value={formik.values[field as keyof typeof formik.values]}
                                onBlur={() => handleBlur(field)}
                                onFocus={() => handleFocus(field)}
                            />
                            {formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors] && (
                                <div className="text-[12px] font-[400] mb-[15px] ml-[6px] text-red-500">
                                    {formik.errors[field as keyof typeof formik.errors]}
                                </div>
                            )}
                            <label
                                htmlFor={field}
                                className={`taglabel absolute left-3 transition-all duration-200 pointer-events-none
                                    ${(inputeStates[field as keyof typeof inputeStates].isFocused || inputeStates[field as keyof typeof inputeStates].value) ?
                                        '-top-2 text-xs bg-white px-1 text-blue-500' :
                                        'top-4 text-[#9CA3AF] '
                                    }`
                                }
                            >
                                {
                                    field === "fullName" ? "Your name" :
                                        field === "email" ? "Email" :
                                            field === "password" ? "Password" : "confirmPassword"
                                }
                            </label>
                        </div>
                    )))
                }
                <div
                    className="w-[50%] bg-[#C1C1C1] mb-[25px] py-[8px] px-[6px] text-white rounded-[5px] cursor-pointer"
                    onClick={handleGoogle}
                >
                    <div className="flex items-center gap-[5px] justify-center">
                        <div className="text-[16px] font-[600]">
                            Register with
                        </div>
                        <div className="text-[18px]">
                            <FcGoogle />
                        </div>
                    </div>
                </div>
                <button className="w-full bg-[#1976D2] font-[500] text-[14px] uppercase py-[10px] rounded-[5px] text-white hover:bg-[#1565C0] mb-[20px]">
                    Register
                </button>
                <Link
                    href={"/login"}
                    className="flex justify-center underline-custom text-[#1976D2] cursor-pointer"
                >
                    Log in to your account!
                </Link>
            </form>
        </>
    );
}