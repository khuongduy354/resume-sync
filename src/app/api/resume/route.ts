import { ContentSchema, ResumeSchema } from "@/lib/schemas/resume.schema";
import { ResumeModel } from "@/model/ResumeModel";
import { withAuth, withAuthRequest } from "@/utils/AuthMiddleware";
import { NextResponse } from "next/server";
import z from "zod";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
  handleControllerError,
} from "@/lib/error";

// CREATE a new resume progress
const POSTController = async (req: withAuthRequest) => {
  try {
    // fetch if existed
    const Resume = new ResumeModel(req.supabase);
    const getRes = await Resume.get({ userId: req.user_id });

    // at this point, only one resume per user is allowed
    if (getRes) {
      throw new ConflictError("Resume");
    }

    // create
    const resume = await Resume.create_blank_resume(req.user_id);
    return NextResponse.json(
      { data: ResumeSchema.parse(resume) },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleControllerError(
      error,
      "POST /api/resume"
    );
    return NextResponse.json({ error: message }, { status });
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
      throw new NotFoundError("Resume");
    }

    return NextResponse.json(
      { data: ResumeSchema.parse(res) },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleControllerError(error, "GET /api/resume");
    return NextResponse.json({ error: message }, { status });
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

    let parsedBody;
    try {
      parsedBody = bodySchema.parse(body);
    } catch (zodError) {
      throw new ValidationError("Invalid request body", zodError);
    }

    // update
    const Resume = new ResumeModel(req.supabase);
    const resume = await Resume.update(parsedBody.id, {
      content: parsedBody.content,
      user_updated_at: parsedBody.user_updated_at,
    });

    return NextResponse.json(
      { data: ResumeSchema.parse(resume) },
      { status: 200 }
    );
  } catch (error) {
    const { message, status } = handleControllerError(
      error,
      "PATCH /api/resume"
    );
    return NextResponse.json({ error: message }, { status });
  }
};

export const PATCH = withAuth(PATCHController);
