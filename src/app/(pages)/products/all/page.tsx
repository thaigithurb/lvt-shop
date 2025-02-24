import { AllItems } from "@/app/components/AllItems/AllItems";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Products",
    description: "Variety Products",
};

export default function All() {
    return (
        <>
            <AllItems />
        </>
    );
}
