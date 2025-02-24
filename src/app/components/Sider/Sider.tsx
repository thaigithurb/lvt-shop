"use client"

import { useEffect, useState } from "react";
import { MenuItem } from "./MenuItem";
import axios from "axios";

export const Sider = (props: any) => {

    const {className} = props;

    const [menu, setMenu] = useState<any[]>([]);
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("https://dummyjson.com/c/e4b9-e72f-4aec-8248");
                setMenu(res.data);
            }
            catch (error) {
                console.error("Failed to fetch total items", error);
            }
        }
        fetchMenu();
    }, [])

    return (
        <>
            <div className={className}>
                <nav className="sticky top-0 h-screen overflow-y-auto">
                    <ul className="">
                        {
                            menu && menu.map((item, index) => (
                                <MenuItem item={item} key={index} />
                            ))
                        }
                    </ul>
                </nav>
            </div>

        </>
    );
}