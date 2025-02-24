"use client"

import { FaCartShopping } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebaseConfig";
import { get, onValue, ref } from "firebase/database";
import { Badge, Box, Button, Grow, IconButton } from "@mui/material";
import Swal from 'sweetalert2';

export const Header = () => {

    const [isVisible, setIsVisible] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    const [userState, setUserState] = useState<string>("Log In / Register");
    const [fullname, setFullname] = useState<any>(<FaRegUser />);
    const [bagdeContentCount, setBagdeContentCount] = useState<any>(0);

    useEffect(() => {
        const handler = (event: any) => {
            if (!boxRef.current?.contains(event.target)) {
                setIsVisible(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserState("Log Out");
                const userRef = ref(db, `users/${user.uid}`);
                const userSnapshot = await get(userRef);
                if (userSnapshot.exists()) {
                    setFullname(userSnapshot.val().fullName);
                }
                const cartRef = ref(db, 'cart/' + user.uid);
                onValue(cartRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const totalQuantity = Object.values(data).reduce((acc: any, item: any) => acc + item.quantity, 0);
                        setBagdeContentCount(totalQuantity);
                    }
                    else {
                        setBagdeContentCount(0);
                    }
                })
            } else {
                setUserState("Log In / Register");
                setFullname(<FaRegUser />);
            }
        });
        return () => unsubscribe();
    }, []);


    return (
        <>
            <header className="p-[12px] sm:p-[16px] rounded-b-[8px] border border-[#7b7b7b] shadow-custom z-[40] relative">
                <div className="flex justify-between items-center">
                    <div className="flex gap-[10px] sm:gap-[35px] items-center">
                        <Link href={"/"} className="w-[60px] object-cover">
                            <img
                                src="/shop-logo.png"
                                className="w-full object-cover h-full transition-transform duration-300 transform hover:scale-110"
                            />
                        </Link>
                        <Link href={"/"} className="text-[18px] sm:text-[20px] font-[650] hover:text-[#666666]">
                            Home
                        </Link>
                        <Link href={"/products/all"} className="text-[18px] sm:text-[20px] font-[650] hover:text-[#666666]">
                            Products
                        </Link>
                    </div>
                    <div className="flex gap-[5px] md:gap-[20px] items-center">
                        {
                            userState === "Log Out" &&
                            <Link
                                href={"/user/cart"}
                                className="cursor-pointer"
                            >
                                <Badge 
                                    color="primary" 
                                    badgeContent={bagdeContentCount}
                                >
                                    <FaCartShopping className="text-[23px] md:text-[26px]"/>
                                </Badge>
                            </Link>
                        }
                        <div
                            className={`${typeof fullname === 'string' ? "text-[20px] " : "text-[26px] "} text-nowrap group p-[6px] rounded-full cursor-pointer text-center relative `}
                            ref={boxRef}
                        >
                            <Box
                                onClick={() => { setIsVisible(!isVisible) }}
                                className=""
                            >

                                <IconButton
                                    sx={{
                                        paddingX: "6px",
                                        paddingY: "6px",
                                        color: "black",
                                        fontFamily: "Be Vietnam Pro",
                                        "&:hover": {
                                            backgroundColor: "#F5F5F5",
                                        }
                                    }}
                                >
                                    {fullname}
                                </IconButton>
                                <Grow
                                    in={isVisible}
                                    style={{ transformOrigin: '0 0 0' }}
                                >
                                    <Box
                                        className={`bg-white drop-shadow-lg shadow-md border text-nowrap absolute rounded-[6px] mt-[5px] py-[8px] font-[400] text-[16px] right-[-10px]`}
                                    >
                                        {userState === "Log Out" ? (
                                            <Button
                                                onClick={() => {
                                                    auth.signOut();
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
                                                        title: "Logged out successfully"
                                                    });
                                                }}
                                                sx={{
                                                    paddingX: "6px",
                                                    paddingY: "6px",
                                                    color: "black",
                                                    fontFamily: "Be Vietnam Pro",
                                                    "&:hover": {
                                                        backgroundColor: "#F5F5F5",
                                                    }
                                                }}
                                            >
                                                {userState}
                                            </Button>
                                        ) : (
                                            <Link
                                                href="/login"
                                            >
                                                <Button
                                                    sx={{
                                                        paddingX: "6px",
                                                        paddingY: "6px",
                                                        color: "black",
                                                        fontFamily: "Be Vietnam Pro",
                                                        "&:hover": {
                                                            backgroundColor: "#F5F5F5",
                                                        }
                                                    }}
                                                >
                                                    {userState}
                                                </Button>
                                            </Link>
                                        )}
                                    </Box>
                                </Grow>
                            </Box>

                        </div>

                    </div>
                </div>
            </header >
        </>
    );
}