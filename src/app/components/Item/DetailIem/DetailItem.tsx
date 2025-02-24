"use client"

import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaSpinner } from "react-icons/fa";
import ReplyIcon from '@mui/icons-material/Reply';
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebaseConfig";
import { child, get, ref, set, update } from "firebase/database";
import Swal from "sweetalert2";
import { toast, Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const DetailItem = (props: any) => {

    const { id } = props;
    const [item, setItem] = useState<any>(null);
    const router = useRouter();
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchDetailItem = async () => {
            try {
                const url = `https://dummyjson.com/products/${id}`;
                const res = await axios.get(url);
                setItem(res.data);
            }
            catch {
                console.log("Failed to fetch detail item");
            }
            finally {
                setInitialLoading(false);
            }
        }
        fetchDetailItem();
    }, [id]);

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl" />
            </div>
        );
    }

    const handleAdd = async () => {
        const user = auth.currentUser;
        if (user !== null) {
            const uid = user.uid;
            const cartRef = ref(db, 'cart/' + uid);
            const itemRef = child(cartRef, id);
            try {
                const snapshot = await get(itemRef);
                if (snapshot.exists()) {
                    const existingItem = snapshot.val();
                    const updatedQuantity = existingItem.quantity + 1;
                    await update(itemRef, { quantity: updatedQuantity });
                    toast.info(`Quantity of ${item.title} increased!`, {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                } else {
                    await set(itemRef, {
                        itemId: id,
                        itemName: item.title,
                        itemPrice: item.price,
                        itemImg: item.thumbnail,
                        quantity: 1,
                    });
                    toast.success(`Added ${item.title} successfully!`, {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                }
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You have to login first!",
                footer: `<a href="/login">Log in now!</a>`,
                customClass: {
                    footer: "error-noti-addToCart"
                }
            });
            console.log("User is not authenticated");
        }
    };

    return (
        <>
            <IconButton
                sx={{
                    marginLeft: {
                        md: '50px',
                        sm: '20px',
                        xs: '10px'
                    },
                    marginTop: {
                        sm: '20px',
                        xs: '10px'
                    },
                    color: "black",
                    marginBottom: {
                        md: '20px',
                        xs: '10px'
                    },
                }}
                onClick={() => {
                    router.back();
                }}
            >
                <ReplyIcon 
                    sx={{
                        fontSize: {
                            md: '50px',
                            xs: '35px'
                        }
                    }}
                />
            </IconButton>
            <div className="xl:max-w-screen-lg md:max-w-screen-md max-w-screen-sm sm:p-0 px-[10px] md:mb-0 mb-[60px] mx-auto">
                {
                    item &&
                    <>
                        <div className="md:flex border border-black p-[30px] sm:p-[40px] lg:p-[50px] rounded-[18px] gap-[30px] drop-shadow-lg shadow-lg bg-[#fcfbfb]">
                            <div className="md:m-0 mb-[15px] md:w-[40%] border-[#c1c0c0] flex justify-center border rounded-[18px] shadow-sm drop-shadow-md">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="text-[26px] md:text-[32px] lg:text-[38px]">
                                    <div className="mb-[5px] font-[600]">
                                        {item.title}
                                    </div>
                                    <p className="text-[#7C7C7C] text-[13px] md:text-[15px] lg:text-[17px] mb-[14px] md:mb-[20px]">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center gap-[40px] mb-[12px] md:mb-[15px]">
                                        <div className="text-[22px] md:text-[26px] lg:text-[30px] font-[600]">
                                            {item.price + "$"}
                                        </div>
                                    </div>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            height: "45px",
                                            gap: "10px",
                                            borderRadius: "12px"
                                        }}
                                        onClick={handleAdd}
                                    >
                                        <FaShoppingCart className="text-[14px] md:text-[16px]" />
                                        Add to cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <ToastContainer />
        </>
    );
}
