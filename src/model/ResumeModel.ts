import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

// resume schema{
//   owner_id:
//   template_url?: string
//   content: {
//     sections: {
//       "info":
//       "education":
//       "skills":
//       "experience":
//     }
//   }
//   created_at?: string,
//   last_updated_at?: string,
// }

// sample data json for below:

export const ContentSchema = z
  .object({
    sections: z
      .object({
        info: z
          .array(
            z.object({
              name: z.string(),
              email: z.string().email().optional(),
              phone: z.string().optional(),
              address: z.string().optional(),
              website: z.string().url().optional(),
              summary: z.string().optional(),
            })
          )
          .default([]),
        education: z
          .array(
            z.object({
              institution: z.string().optional(),
              degree: z.string().optional(),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
            })
          )
          .default([]),
        skills: z.array(z.string()).optional(),
        experience: z
          .array(
            z.object({
              title: z.string().optional(),
              companyName: z.string().optional(),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
            })
          )
          .default([]),
      })
      .default({}),
  })
  .default({});

export const ResumeSchema = z.object({
  owner_id: z.string().uuid(),
  template_url: z.string().optional(),
  created_at: z.string(),
  last_updated_at: z.string(),
  content: ContentSchema,
});

export type IResume = z.infer<typeof ResumeSchema>;
export type IContent = z.infer<typeof ContentSchema>;

type UpdateableFields = {
  content: IContent;
  last_updated_at?: string;
  template_url?: string;
};
// Server-only
export class ResumeModel {
  private supabase: SupabaseClient;
  constructor(supabase_instance: SupabaseClient) {
    this.supabase = supabase_instance;
  }

  static async validate(data: any) {
    return ResumeSchema.parse(data);
  }

  async get(query: { userId: string }) {
    const { data, error } = await this.supabase
      .from("Resume")
      .select()
      .eq("owner_id", query.userId)
      .single();

    if (error) {
      throw new Error(`Error fetching resume: ${error.message}`);
    }

    return ResumeModel.validate(data);
  }

  async create_blank_resume(owner_id: string) {
    const { data, error } = await this.supabase
      .from("Resume")
      .insert({ owner_id })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating resume: ${error.message}`);
    }

    return ResumeModel.validate(data);
  }

  async update(content_part: IContent, last_updated_at?: string) {
    content_part = ContentSchema.parse(content_part);
    let update_payload: UpdateableFields = {
      content: content_part,
    };
    if (last_updated_at) update_payload.last_updated_at = last_updated_at;
    const { data, error } = await this.supabase
      .rpc("update_resume", update_payload)
      .single();
    if (error) {
      throw new Error(`Error updating resume: ${error.message}`);
    }

    return ResumeModel.validate(data);
  }
}
