// app/api/templates/[id]/route.ts
import { withAuth } from "@/utils/AuthMiddleware";
import { NextRequest, NextResponse } from "next/server";
// import { templatesDB } from "@/lib/database"; // Your data source

export const GET = withAuth(async (request, { params }) => {
  const id = params.id;
  // const template = templatesDB.getById(id);

  // if (!template) {
  //   return NextResponse.json({ error: "Template not found" }, { status: 404 });
  // }

  // return NextResponse.json(template);

  // Placeholder response until templatesDB is implemented
  return NextResponse.json({ message: `Template ${id} endpoint` });
});
