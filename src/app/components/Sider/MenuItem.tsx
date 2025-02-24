"use client"

import Link from "next/link";
import { FaCheck } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";

export const MenuItem = (props: any) => {

    const { item } = props;
    const pathName = usePathname();

    return (
        <>
            <Link href={"/products/" + (item.slug)}
                className="flex"
            >
                <Button
                    sx={{
                        padding: '15px',
                        fontWeight: "300",
                        width: "100%",
                        color: "black",
                        display: "flex",
                        fontSize: {
                            lg: '15px',
                        },
                        textTransform: "capitalize",
                        justifyContent: "start",
                        "&:hover": {
                            backgroundColor: "#F5F5F5"
                        },
                        fontFamily: "Be Vietnam Pro",
                    }}
                >
                    <li className="w-full">
                        <div className="flex items-center justify-between text-nowrap">
                            {item.name}
                            <FaCheck className={pathName === "/products/" + (item.slug) ? "block" : "hidden"} />
                        </div>
                    </li>
                </Button>
            </Link>
        </>
    );
}