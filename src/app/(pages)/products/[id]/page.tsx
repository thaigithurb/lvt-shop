"use client"

import { DetailItem } from "@/app/components/Item/DetailIem/DetailItem";
import { useParams } from "next/navigation";


export default function Detail() {

    const { id } = useParams();

    return (
        <>
            <section className="">
                <DetailItem id={id}/>
            </section>
        </>
    );
}