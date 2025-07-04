import { SupabaseClient } from "@supabase/supabase-js";
import {
  IContent,
  ContentSchema,
  ResumeSchema,
} from "@/lib/schemas/resume.schema";

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
