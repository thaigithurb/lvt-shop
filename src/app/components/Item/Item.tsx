import { Button } from "@mui/material";
import Link from "next/link";
import { auth, db } from "@/app/firebaseConfig";
import { child, get, ref, set, update } from "firebase/database";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";

export const Item = (props: any) => {

    const { item } = props;

    const handleAdd = async () => {
        const user = auth.currentUser;
        if (user !== null) {
            const uid = user.uid;
            const cartRef = ref(db, 'cart/' + uid);
            const id = item.id.toString();
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
                        itemId: item.id,
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
            console.log("User is not authenticated");
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You have to login first!",
                footer: `<a href="/login">Log in now!</a>`,
                customClass: {
                    footer: "error-noti-addToCart"
                }
            });
        }
    };

    return (
        <>
            <div className="rounded-[8px] border overflow-hidden shadow-custom1 hover:shadow-custom2 transition duration-300 hover:translate-y-[-5px] transform flex flex-col">
                <Link href={`/products/${item.id}`} className="flex-1">
                    <div className="border-b-[1px] rounded-[8px] shadow-custom">
                        <div className="object-cover overflow-hidden">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="object-contain w-full"

                            />
                        </div>
                        <div className="lg:px-[16px] lg:py-[20px] px-[12px] py-[16px]">
                            <div className="xl:text-[20px] text-[16px] font-[500] mb-[12px] sm:mb-[14px] md:mb-[16px] lg:mb-[18px]">
                                {item.title}
                            </div>
                            <div className="font-[700] text-[14px] xl:text-[16px] text-[#585858]">
                                Price: €{item.price}
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="px-[12px] py-[8px] lg:px-[16px] lg:py-[12px] flex justify-between border border-t-[#DDDDDD]">
                    <Button
                        variant="outlined"
                        sx={{
                            fontFamily: "Be Vietnam Pro",
                            padding: "8px",
                            fontSize: {
                                xs: '11px',
                                lg: '13px',
                            },
                        }}
                    >
                        <Link href={`/products/${item.id}`}>
                            MORE DETAIL
                        </Link>
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            fontFamily: "Be Vietnam Pro",
                            fontSize: {
                                xs: '11px',
                                lg: '13px',
                            },
                            padding: "8px",
                        }}
                        onClick={handleAdd}
                    >
                        ADD TO CART
                    </Button>

                </div>
            </div>
        </>
    );
}