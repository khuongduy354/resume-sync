import { SupabaseClient } from "@supabase/supabase-js";
import { IContent, IResume } from "@/lib/schemas/resume.schema";
import { DatabaseError, NotFoundError } from "@/lib/error";

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
      throw new DatabaseError(
        `fetching resume for user ${query.userId}`,
        error
      );
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
      throw new DatabaseError(`creating resume for user ${owner_id}`, error);
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
      throw new DatabaseError(`updating resume ${resume_id}`, error);
    }

    if (!data) {
      throw new NotFoundError(`Resume with ID ${resume_id}`);
    }

    return data;
  }
}
