import { TemplateModel } from "@/model/TemplateMode";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: "Supabase URL is not defined" },
      { status: 500 }
    );
  }

  // fetch all templates name
  const templatesName = await TemplateModel.getAllTemplatesNames();

  if (!templatesName || templatesName.length === 0) {
    return NextResponse.json({ error: "No templates found" }, { status: 500 });
  }

  // add extra url to it
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume//`;
  const templatesRes = templatesName.map((template) => {
    return {
      name: template.name,
      url: `${base}${template.name}`,
    };
  });

  return NextResponse.json(templatesRes, { status: 200 });
};
