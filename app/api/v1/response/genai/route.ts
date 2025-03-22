import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const prisma = new PrismaClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  try {
    const { prompt } = await req.json();
    const result = await model.generateContent(prompt);
    const messages = await prisma.chat.create({
      data: {
        messages: prompt,
        userId: session?.user?.id,
      },
    });
    const responseText = await result.response.text();
    console.log(messages);
    return NextResponse.json({
      responseText,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "Something is up!",
    });
  }
}
