import { ResumeModel } from "@/model/ResumeModel";
import { withAuth, withAuthRequest } from "@/utils/AuthMiddleware";
import { NextResponse } from "next/server";

// CREATE a new resume progress
const POSTController = async (req: withAuthRequest) => {
  try {
    // create new progress
    const Resume = new ResumeModel(req.supabase);
    const getRes = await Resume.get({ userId: req.user_id });
    if (getRes) {
      // at this point, only one resume per user is allowed
      return NextResponse.json(
        { error: "Resume already exists" },
        { status: 400 }
      );
    }
    const resume = await Resume.create_blank_resume(req.user_id);
    return NextResponse.json({ data: resume }, { status: 201 });
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
    const Resume = new ResumeModel(req.supabase);
    const res = await Resume.get({ userId: req.user_id });
    if (!res) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ data: res }, { status: 200 });
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
    // update progress
    const Resume = new ResumeModel(req.supabase);
    const body = await req.json();
    const resume = await Resume.update(body);
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ data: resume }, { status: 200 });
  } catch (error) {
    console.error("Error updating resume progress:", error);
    return NextResponse.json(
      { error: "Failed to update resume progress" },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth(PATCHController);
