import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export class TemplateModel {
  // This use a public bucket, so client can access it directly
  static async getAllTemplatesNames() {
    const supabaseClient = createSupabaseBrowserClient(false);
    const { data, error } = await supabaseClient.storage.from("resume").list();
    if (error) {
      throw new Error(`Error fetching templates: ${error.message}`);
    }
    return data;
  }
}
