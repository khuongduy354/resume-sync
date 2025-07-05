import { SupabaseClient } from "@supabase/supabase-js";
import { IContent, IResume } from "@/lib/schemas/resume.schema";

type UpdateableFields = {
  content: IContent;
  // last_updated_at?: string;
  user_updated_at: IResume["user_updated_at"];
  // template_url?: string;
};
// Server-only
export class ResumeModel {
  private supabase: SupabaseClient;
  constructor(supabase_instance: SupabaseClient) {
    this.supabase = supabase_instance;
  }

  async get(query: { userId: string }) {
    const { data, error } = await this.supabase
      .from("Resume")
      .select()
      .eq("owner_id", query.userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching resume: ${error.message}`);
    }

    return data;
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

    return data;
  }

  async update(resume_id: string, update_payload: UpdateableFields) {
    const { data, error } = await this.supabase
      .rpc("update_resume", {
        p_resume_id: resume_id,
        p_content: update_payload.content,
        p_user_updated_at: update_payload.user_updated_at,
      })
      .single();
    if (error) {
      throw new Error(`Error updating resume: ${error.message}`);
    }

    return data;
  }
}
