"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Item } from "../Item/Item";
import { FaSpinner } from "react-icons/fa6";
import { Pagination } from "@mui/material";
import { Sider } from "../Sider/Sider";
import { Functions } from "../Functions/Functions";
import { FiMenu } from "react-icons/fi";
import { ToastContainer } from "react-toastify";

export const SearchResults = () => {
    const params = useSearchParams();
    const [items, setItems] = useState<any[]>([]);
    const limit = 8;
    const [page, setPage] = useState(1);
    const [skip, setSkip] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const keyWord = params.get("keyword") || "";
    const [sortOption, setSortOption] = useState("default");
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    useEffect(() => {
        const fetchSearchItems = async () => {
            try {
                let url = `https://dummyjson.com/products/search?q=${keyWord}&skip=${skip}&limit=${limit}`;
                if (sortOption === "LOWEST PRICE") {
                    url += "&sortBy=price&order=asc";
                } else if (sortOption === "HIGHEST PRICE") {
                    url += "&sortBy=price&order=desc";
                }
                const res = await axios.get(url);
                setItems(res.data.products);
                const total = Math.ceil(res.data.total / limit);
                setTotalPages(total);
            } catch (error) {
                console.error("Failed to fetch search items", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchSearchItems();
    }, [keyWord, skip, sortOption]);

    const handlePageChange = (e: any, value: number) => {
        setPage(value);
        setSkip((value - 1) * limit);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl" />
            </div>
        );
    }

    const openNav = () => {
        const sidenav = document.getElementsByClassName("sidenav")[0] as HTMLElement;
        sidenav.style.width = "250px";
        setIsMenuVisible(true);
    }

    const closeNav = () => {
        const sidenav = document.getElementsByClassName("sidenav")[0] as HTMLElement;
        sidenav.style.width = "0";
        setIsMenuVisible(false);
    }

    return (
        <>
            <section className="flex gap-[10px] xl:gap-[20px] justify-center">
                {/* <div className="md:hidden block">
                    <div className="flex items-center sm:justify-normal justify-between">
                        <div
                            className={`md:hidden md:mr-0 mr-[20px] text-[30px] menu-icon ${isMenuVisible ? 'hidden' : ''}`}
                            onClick={openNav}
                        >
                            <FiMenu />
                        </div>
                        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isMenuVisible ? '' : 'hidden'}`} onClick={closeNav}></div>
                    </div>

                </div> */}
                <Sider className={` bg-white hidden md:block relative xl:w-[220px]`} />
                <div className="flex-1 p-[8px]">
                    <div className="flex items-center sm:justify-normal justify-between">
                        <div
                            className={`md:hidden md:mr-0 mr-[20px] text-[30px] menu-icon ${isMenuVisible ? 'hidden' : ''}`}
                            onClick={openNav}
                        >
                            <FiMenu />
                        </div>
                        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isMenuVisible ? '' : 'hidden'}`} onClick={closeNav}></div>
                        <div className={`sidenav`}>
                            <Sider />
                        </div>
                    </div>
                    <Functions onSortChange={setSortOption} />
                    <div className="mt-[12px] relative">
                        {
                            items.length > 0 ? (
                                <>
                                    <div className="">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[10px] lg:gap-[20px]">
                                            {items.map((item: any, index: any) => (
                                                <Item item={item} key={index} />
                                            ))}
                                        </div>
                                        <div className="my-[40px] ml-[30px]">
                                            {totalPages && (
                                                <Pagination
                                                    count={totalPages}
                                                    color="primary"
                                                    page={page}
                                                    onChange={handlePageChange}
                                                    sx={{
                                                        fontFamily: "Be Vietnam Pro"
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute top-[100px] w-full sm:w-[80%] object-cover left-[0px] sm:left-[60px] md:left-[120px]">
                                        <img
                                            src="/oops.png"
                                            alt="no products found"
                                            className="h-full w-full"
                                        />
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}