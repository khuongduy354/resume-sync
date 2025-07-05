import { ContentSchema, ResumeSchema } from "@/lib/schemas/resume.schema";
import { ResumeModel } from "@/model/ResumeModel";
import { withAuth, withAuthRequest } from "@/utils/AuthMiddleware";
import { NextResponse } from "next/server";
import z from "zod";

// CREATE a new resume progress
const POSTController = async (req: withAuthRequest) => {
  try {
    // fetch if existed
    const Resume = new ResumeModel(req.supabase);
    const getRes = await Resume.get({ userId: req.user_id });

    // at this point, only one resume per user is allowed
    if (getRes) {
      return NextResponse.json(
        { error: "Resume already exists" },
        { status: 400 }
      );
    }

    // create
    const resume = await Resume.create_blank_resume(req.user_id);
    return NextResponse.json(
      { data: ResumeSchema.parse(resume) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resume progress:", error);
    return NextResponse.json(
      { error: "Failed to create resume progress" },
      { status: 500 }
    );
  }
};
export const POST = withAuth(POSTController);

// return current progress
const GETController = async (req: withAuthRequest) => {
  try {
    // fetch
    const Resume = new ResumeModel(req.supabase);
    const res = await Resume.get({ userId: req.user_id });

    // responses
    if (!res) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: ResumeSchema.parse(res) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching resume progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume progress" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(GETController);

// update current progress
const PATCHController = async (req: withAuthRequest) => {
  try {
    // sanitize body
    const body = await req.json();
    const bodySchema = z.object({
      id: z.string(),
      content: ContentSchema,
      user_updated_at: ResumeSchema.shape.user_updated_at,
    });
    const parsedBody = bodySchema.parse(body);

    // update
    const Resume = new ResumeModel(req.supabase);
    const resume = await Resume.update(parsedBody.id, {
      content: parsedBody.content,
      user_updated_at: parsedBody.user_updated_at,
    });

    // responses
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json(
      { data: ResumeSchema.parse(resume) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating resume progress:", error);
    return NextResponse.json(
      { error: "Failed to update resume progress" },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth(PATCHController);
