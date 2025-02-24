import { RegisterForm } from "@/app/components/RegisterForm/RegisterForm";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "LVT Shop",
    description: "Đăng kí",
};

export default function Register() {
    return (
        <>
            <section className='container mx-auto flex justify-center mb-[80px]'>
                <div className="w-[300px]">
                    <div className="font-[600] text-[24px] text-center mb-[20px] mt-[50px]">
                        Register
                    </div>
                    <RegisterForm />
                </div>
            </section>
        </>
    );
}