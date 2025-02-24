import { AddToCart } from "@/app/components/Cart/AddToCart";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Your cart",
    description: "Let's checkout",
};

export default function Cart() {
    return (
        <>
            <AddToCart />
        </>
    );
}