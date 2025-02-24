import Link from "next/link";
import type { Metadata } from "next";
import { Box, Button, Fab } from "@mui/material";

export const metadata: Metadata = {
  title: "LVT Shop",
  description: "Best shop ever",
};

export default function Home() {
  return (
    <>
      <section className="relative bg-bg-homepage bg-bottom bg-no-repeat">
        <div className="inset-0 bg-black opacity-50 absolute"></div>
        <div className="relative w-auto lg:w-[800px] ml-auto md:px-0 px-[6px] mr-auto py-[165px] lg:py-[155px] text-center flex flex-col gap-[20px] md:gap-[30px] text-white justify-center items-center">
          <div className="md:text-[13px] text-[12px] font-[700]">
            Your Destination for Quality Finds
          </div>
          <div className="md:text-[40px] text-[30px] font-[700]">
            LVT Shop
          </div>
          <div className="lg:text-[16px] text-[14px] font-[400]">
            Welcome to LVT Shop, where every products tells a story. From handpicked items to the lastest trends!
          </div>
          <Link href={"/products/all"}>
            <Box>
              <Button 
                variant="outlined" 
                sx={{
                  borderRadius: '8px',
                  padding: '16px',
                  color: "white",
                  borderColor: "white",
                  fontFamily: "Be Vietnam Pro",
                  '&:hover': {
                    borderColor: '#1976D2',
                    color: '#009BFF',
                    transition: 'all 0.3s ease',
                  },
                  fontSize: {
                    sm: '14px', // Medium screens
                    md: '16px', // Large screens
                  },
                }}
              >
                Explore Our Products
              </Button>
            </Box>

          </Link>
        </div>
      </section>
    </>
  );
}
