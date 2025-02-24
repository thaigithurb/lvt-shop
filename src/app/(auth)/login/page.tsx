import { LoginForm } from "@/app/components/LoginForm/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LVT Shop",
  description: "Đăng nhập",
};

export default function Login() {
  return (
    <>  
      <section className='container mx-auto flex justify-center '>
        <div className="w-[300px]">
          <div className="font-[600] text-[24px] text-center mb-[20px] mt-[50px]">
            Log In
          </div>
          <LoginForm />
        </div>
      </section>
    </>
  );
}