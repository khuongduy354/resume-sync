import { TemplateModel } from "@/model/TemplateMode";
import { NextRequest, NextResponse } from "next/server";
import { ConfigurationError, handleControllerError } from "@/lib/error";

export const GET = async (req: NextRequest) => {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new ConfigurationError("NEXT_PUBLIC_SUPABASE_URL");
    }

    // fetch all templates name
    const templatesName = await TemplateModel.getAllTemplatesNames();

    // add extra url to it, filter only html
    const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resume//`;
    const templatesRes = templatesName
      .filter((template) => template.name.endsWith(".html"))
      .map((template) => {
        return {
          name: template.name,
          url: `${base}${template.name}`,
        };
      });

    return NextResponse.json(templatesRes, { status: 200 });
  } catch (error) {
    const { message, status } = handleControllerError(
      error,
      "GET /api/templates"
    );
    return NextResponse.json({ error: message }, { status });
  }
};
