"use client"

import { auth, db } from "@/app/firebaseConfig";
import { Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { get, onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { ButtonItem } from "../Button/ButtonItem";
import Swal from "sweetalert2";

export const AddToCart = () => {

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [items, setItems] = useState<any[]>([]);

    // Fetch items in the user's cart
    useEffect(() => {
        const fetchDataItems = async (user: any) => {
            if (user) {
                const cartRef = ref(db, `/cart/${user.uid}`);
                onValue(cartRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const itemsArray = Object.values(data);
                        const totalPriceTmp = itemsArray.reduce((acc: number, item: any) => acc + (item.itemPrice * item.quantity), 0);
                        setTotalPrice(totalPriceTmp);
                    } else {
                        setTotalPrice(0);
                        setItems([]);
                    }
                });
            }
        };

        // Authenticate user
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchDataItems(user);
        });

        return () => unsubscribe();
    }, []);

    const handleCheckOut = async () => {
        const user = auth.currentUser;
        if (user) {
            const cartRef = ref(db, `/cart/${user.uid}`);
            try {
                if (items.length) {
                    Swal.fire({
                        title: "Your order has been placed!",
                        icon: "success",
                        draggable: true
                    });
                }
                else {
                    Swal.fire({
                        title: "You haven't bought anything yet!",
                        icon: "warning",
                        draggable: true
                    });
                }
                await remove(cartRef);
                setItems([]);
                setTotalPrice(0);
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        }
    }

    // item trong giỏ hàng của người dùng 
    useEffect(() => {
        const fetchDataItems = async (user: any) => {
            try {
                if (user) {
                    const cartRef = ref(db, `cart/${user.uid}`);
                    try {
                        const snapshot = await get(cartRef);
                        if (snapshot.exists()) {
                            const cartData = snapshot.val();
                            const itemsArray = Object.keys(cartData).map(key => ({
                                id: key,
                                ...cartData[key]
                            }));
                            setItems(itemsArray);
                        } else {
                            console.log("No data available");
                        }
                    } catch (error) {
                        console.error("Error fetching cart data:", error);
                    }
                } else {
                    console.log("User is not authenticated");
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            } finally {
            }
        };
        // xác thực 
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchDataItems(user);
        });

        return () => unsubscribe();
    }, []);

    // tăng sản phẩm trong giỏ hàng
    const handleIncrease = async (itemId: string) => {
        const user = auth.currentUser;
        if (user) {
            const itemRef = ref(db, `cart/${user.uid}/${itemId}`);
            try {
                const snapshot = await get(itemRef);
                if (snapshot.exists()) {
                    const itemData = snapshot.val();
                    const newQuantity = itemData.quantity + 1;
                    await update(itemRef, { quantity: newQuantity });
                    const cartRef = ref(db, `cart/${user.uid}`);
                    const cartSnapshot = await get(cartRef);
                    if (cartSnapshot.exists()) {
                        const cartData = cartSnapshot.val();
                        const itemsArray = Object.keys(cartData).map(key => ({
                            id: key,
                            ...cartData[key]
                        }));
                        setItems(itemsArray);
                    }
                }
            } catch (error) {
                console.error("Error updating item quantity:", error);
            }
        }
    };

    // giảm sản phẩm trong giỏ hàng
    const handleDecrease = async (itemId: string) => {
        const user = auth.currentUser;
        if (user) {
            const itemRef = ref(db, `cart/${user.uid}/${itemId}`);
            try {
                const snapshot = await get(itemRef);
                if (snapshot.exists()) {
                    const itemData = snapshot.val();
                    const newQuantity = itemData.quantity - 1;
                    await update(itemRef, { quantity: newQuantity });
                    const cartRef = ref(db, `cart/${user.uid}`);
                    const cartSnapshot = await get(cartRef);
                    if (cartSnapshot.exists()) {
                        const cartData = cartSnapshot.val();
                        const itemsArray = Object.keys(cartData).map(key => ({
                            id: key,
                            ...cartData[key]
                        }));
                        setItems(itemsArray);
                    }
                }
            } catch (error) {
                console.error("Error updating item quantity:", error);
            }
        }
    };

    const handleDelete = async (itemId: string) => {
        const user = auth.currentUser;
        if (user) {
            const itemRef = ref(db, `cart/${user.uid}/${itemId}`);
            try {
                await remove(itemRef);
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    }

    return (
        <>
            <div className="flex justify-between pt-[20px] px-[20px] ">
                <div>
                    {
                        items.length > 0 ? (
                            items.map((item, index) => (
                                <div key={index} className="h-fit mb-[5px]">
                                    <div className="flex bg-[#ffffff] gap-[10px] p-[20px] rounded-[8px] drop-shadow-md shadow-md">
                                        <div className="object-contain overflow-hidden rounded-[8px] w-[80px]">
                                            <img
                                                src={item.itemImg}
                                                alt={item.itemName}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex gap-[5px]">
                                                <div className="font-[600]">
                                                    Product:
                                                </div>
                                                <div className="font-[300]">
                                                    {item.itemName}
                                                </div>
                                            </div>
                                            <div className="flex gap-[5px]">
                                                <div className="font-[600]">
                                                    Price:
                                                </div>
                                                <div className="font-[300]">
                                                    {item.itemPrice}
                                                </div>
                                            </div>
                                            <div className="flex gap-[5px]">
                                                <div className="font-[600]">
                                                    ID:
                                                </div>
                                                <div className="font-[300]">
                                                    {item.itemId}
                                                </div>
                                            </div>
                                        </div>
                                        <ButtonItem item={item} handleIncrease={handleIncrease} handleDecrease={handleDecrease} handleDelete={handleDelete} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className=''>
                                <img
                                    src='/empty-cart.png'
                                    alt='emptyCart'
                                />
                            </div>
                        )
                    }
                </div>
                <div className="">
                    <form className="">
                        <div className="bg-[#fcf9f9] p-[40px] shadow-md drop-shadow-md rounded-[8px] flex flex-col gap-y-[15px]">
                            <div className="text-center text-[24px] font-[600]">
                                ORDER SUMMARY
                            </div>
                            <div className="flex justify-between text-[#555555]">
                                <div>
                                    Total:
                                </div>
                                <div>
                                    ${totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <div className="border-b border-b-[#B2B2B2] py-[10px] flex justify-between gap-[15px] text-[#555555]">
                                <div className="">
                                    Estimate Shipping:
                                </div>
                                <div>
                                    $0.00
                                </div>
                            </div>
                            <div className="flex justify-between text-[#555555] font-[500]">
                                <div>
                                    Subtotal:
                                </div>
                                <div>
                                    ${totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: "capitalize",
                                    fontFamily: "Be Vietnam Pro"
                                }}
                                onClick={handleCheckOut}
                            >
                                Checkout
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}