import { AddToCart } from "@/app/components/Cart/AddToCart";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Giỏ Hàng",
    description: "Let's checkout",
};

export default function Cart() {
    return (
        <>
            <AddToCart />
        </>
    );
}