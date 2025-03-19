// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient()
// export async function POST(req: NextRequest, res: NextResponse) {
//     const { nane, email, password } = await req.json()
//     const saltRounds = 10;

//     const hashedPassword = await bcrypt.hash(password, saltRounds)
//     try {
//         const exisitingUser = await prisma.user.findUnique({
//             where: {
//                 email
//             }
//         })
//         if (exisitingUser && exisitingUser.password) {
//             return NextResponse.json({ error: "User already exists" }, { status: 409 })
//         } else if (exisitingUser && !exisitingUser.password) {
//             const user = await prisma.user.update({
//                 where: {
//                     email
//                 },
//                 data: {
//                     password: hashedPassword
//                 }
//             })
//             const token = await jwt.sign
//         }

//     } catch {

//     }
// }