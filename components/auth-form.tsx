"use client"

import type React from "react"
import { useState } from "react"
import { GithubIcon, Loader2, EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react"
import { Separator } from "./ui/Separator"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function AuthForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const credentialsAction = async (formData: FormData) => {
        try {
            setIsLoading(true)
            const result = await signIn("credentials", {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                redirect: false,
            })
            if (result?.error) {
                toast.error("Incorrect email or password")
            } else {
                const session = await fetch('/api/auth/session')
                const data = await session.json()
                toast.success("Logged in successfully!")
                router.push(`/chats/${data.user.id}`)
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">Welcome Back</h1>
                <p className="text-muted-foreground font-semibold text-gray-400">Sign in to your account to continue</p>
            </div>

            <form action={credentialsAction} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-white">
                            Email
                        </label>
                        <div className="relative ">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 " />
                            <input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 py-2 rounded bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-white">
                                Password
                            </label>
                            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                name="password"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-10 py-2 rounded bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>


                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-70"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-300">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className="flex items-center justify-center py-2 px-4 rounded bg-gray-900 border border-gray-800 text-white hover:bg-gray-800"
                    onClick={async () => {
                        const response = await signIn("google", { redirect: false })
                        if (!response?.error) {
                            const session = await fetch("/api/auth/session")
                            const data = await session.json()
                            router.push(`/chats/${data.user.id}`)
                        }

                    }}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center py-2 px-4 rounded bg-gray-900 border border-gray-800 text-white hover:bg-gray-800"
                    onClick={async () => {
                        const response = await signIn("github", { redirect: false })
                        if (!response?.error) {
                            const session = await fetch("/api/auth/session")
                            const data = await session.json()
                            router.push(`/chats/${data.user.id}`)
                        }

                    }}
                >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    GitHub
                </button>
            </div>

            <div className="text-center text-sm text-gray-300">
                Don&apos;t have an account?{" "}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign up
                </a>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground md:hidden">
                <button
                    onClick={() => alert("View solar system animation")}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    View solar system animation
                </button>
            </div>
        </div>
    )
}