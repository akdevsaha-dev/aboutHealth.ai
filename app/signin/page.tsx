import { AuthForm } from "@/components/auth-form";
import { SolarSystem } from "@/components/ui/solar-system";

export default function Signin() {
    return (
        <div className="flex min-h-screen w-full bg-black overflow-hidden">
            <div className="hidden md:flex md:w-1/2 relative">
                <SolarSystem />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative z-20 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm">
                <AuthForm />
            </div>
        </div>
    )
}