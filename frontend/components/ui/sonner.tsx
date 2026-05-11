"use client"

import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          // 🟢 THE FIX: 
          // 1. Lower opacity (white/20) so more background shines through.
          // 2. High blur (blur-2xl) for that "thick glass" feel.
          // 3. A very subtle dark shadow + a white border for the "edge" highlight.
          toast:
            "group toast !bg-white/20 !backdrop-blur-2xl !text-zinc-950 !border !border-white/40 !shadow-[0_20px_50px_rgba(0,0,0,0.05)] !rounded-3xl !px-6 !py-5",
          
          description: "!text-zinc-500 !text-[11px] !font-medium !uppercase !tracking-[0.2em]",
          
          actionButton:
            "!bg-black !text-white !rounded-full !px-5 !py-2 !text-[10px] !font-bold !uppercase !tracking-widest !shadow-lg",
          
          success: "!text-black",
          error: "!text-red-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }