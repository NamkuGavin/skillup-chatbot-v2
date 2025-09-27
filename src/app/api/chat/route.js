import { NextResponse } from "next/server";
import { SkillUpAgent } from "@/lib/agents";

export async function POST(request) {
  try {
    const { message, context = {} } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("Received message:", message.substring(0, 100));
    console.log("Context:", context);

    const agent = new SkillUpAgent();
    let response;

    // Handle specific features based on context
    if (context.currentFeature) {
      switch (context.currentFeature) {
        case "interview_practice":
          response = await agent.handleInterviewPractice(message, context);
          break;
        case "skill_analysis":
          response = await agent.handleSkillAnalysis(message);
          break;
        case "career_tips":
          response = await agent.handleCareerAdvice(message);
          break;
        default:
          response = await agent.processMessage(message, context);
      }
    } else {
      response = await agent.processMessage(message, context);
    }

    console.log("AI Response generated successfully");

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
