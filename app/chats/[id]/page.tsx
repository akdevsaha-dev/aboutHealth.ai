"use client";
import { Chat } from "@/components/Chat";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
    const { data: session, status } = useSession();
    console.log(session)
    if (status === "loading") {
        return <div className="flex w-full h-screen justify-center items-center text-white animate-spin ">
            <LoaderCircle size={40} />
        </div>
    }
    if (!session?.user) {
        return redirect("/signin")
    }
    return <div>
        <Chat />
    </div>
}