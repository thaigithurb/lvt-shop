"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Functions } from "@/app/components/Functions/Functions";
import { Sider } from "@/app/components/Sider/Sider";
import { Pagination } from "@mui/material";
import { Item } from "../Item/Item";
import { ToastContainer } from "react-toastify";
import { FiMenu } from "react-icons/fi";

export const AllItems = () => {

    const [items, setItems] = useState<any[]>([]);
    const limit = 8;
    const [page, setPage] = useState(1);
    const [skip, setSkip] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const [sortOption, setSortOption] = useState("default");
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // lấy tất cả sản phẩm 
    useEffect(() => {
        const fetchTotalItems = async () => {
            try {
                let url = `https://dummyjson.com/products?skip=${skip}&limit=${limit}`;
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
                console.error("Failed to fetch total items", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchTotalItems();
    }, [skip, sortOption]);

    // xử lí pagination 
    const handlePageChange = (e: any, value: number) => {
        setPage(value);
        setSkip((value - 1) * limit);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    //

    // xử lí load trang
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
                <Sider className={`w-[200px] relative md:w-[220px] md:block hidden`}/>
                <div className="p-[8px] md:flex-1">
                    <div className="">
                        <div className="flex items-center sm:justify-normal justify-between">
                            <div className="md:hidden block">
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
                            <div className="flex-1 items-center">
                                <Functions onSortChange={setSortOption} />
                            </div>
                        </div>
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
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    );
}