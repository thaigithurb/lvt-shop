"use client"

import { IoMdSearch } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button, Grow, List, ListItem, ListItemButton, Paper } from "@mui/material";
import { IoMdArrowDropleft } from "react-icons/io";

export const Functions = ({ onSortChange }: { onSortChange: (sortOption: string) => void }) => {
    const [keyWord, setKeyWord] = useState("");
    const router = useRouter();
    const boxRef = useRef<HTMLDivElement>(null);
    const params = useSearchParams();
    const [sortOption, setSortOption] = useState("default");
    const [isVisible, setIsVisible] = useState(false);

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
        const keywordFromUrl = params.get("keyword") || "";
        setKeyWord(keywordFromUrl);
    }, [params]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        if (keyWord) {
            router.push(`/products/search?keyword=${keyWord}`);
        } else {
            router.push("/products/all");
        }
    };

    const handleSortChange = (option: string) => {
        setSortOption(option);
        onSortChange(option);
        setIsVisible(false);
    }

    return (
        <div className="mb-[12px] mt-[6px]">
            <div className="sm:flex justify-between items-center relative">
                <div
                    className="relative w-fit"
                    ref={boxRef}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            paddingY: "10px",
                            paddingX: "6px",
                            borderColor: "black",
                            color: "black",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            fontSize: {
                                xs: '11px',
                                sm: '13px',
                            },
                            borderRadius: "6px",
                        }}
                        onClick={() => { setIsVisible(!isVisible) }}
                    >
                        SORT BY: {sortOption.toUpperCase()}
                        <span
                            className="text-[18px] sm:text-[22px]"
                        >
                            <IoMdArrowDropleft />
                        </span>
                    </Button>
                    <Grow
                        in={isVisible}
                        style={{ transformOrigin: '0 0 0' }}
                    >
                        <Paper
                            sx={{
                                position: "absolute",
                                zIndex: "20",
                                width: "fit",
                                paddingY: "8px",
                                fontFamily: "Be Vietnam Pro"
                            }}
                        >
                            <List
                                sx={{
                                    margin: "0",
                                    padding: "0"
                                }}
                            >
                                {
                                    (["DEFAULT", "HIGHEST PRICE", "LOWEST PRICE"]).map((field, index) => (
                                        <ListItem
                                            sx={{
                                                margin: "0",
                                                padding: "0"
                                            }}
                                            key={index}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    margin: "0",
                                                    paddingY: "8px",
                                                    fontSize: {
                                                        sm: '14px',
                                                        xs: '12px',
                                                    },
                                                    textWrap: "nowrap",
                                                    fontFamily: "Be Vietnam Pro"
                                                }}
                                                onClick={() => handleSortChange(field)}
                                            >
                                                {field}
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Paper>
                    </Grow>
                </div>
                <div>
                    <form className="relative w-fit sm:mt-0 mt-[14px]" onSubmit={handleSearch}>
                        <label
                            htmlFor="search"
                            className="font-[400] text-[12px] absolute top-[-9px] bg-white px-[6px] left-[10px] z-10"
                        >
                            Search...
                        </label>
                        <div className="relative w-full rounded-lg shadow-sm flex items-center ">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <IoMdSearch className="ml-[6px] mr-[6px] text-[20px] text-[#090909] pointer-events-none" />
                            </div>
                            <input  
                                autoComplete="off"
                                type="text"
                                name="keyword"
                                className=" border border-black block w-full rounded-[6px] px-3 py-2 pl-10 font-sans text-sm"
                                id="search"
                                value={keyWord}
                                onChange={(e) => setKeyWord(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}