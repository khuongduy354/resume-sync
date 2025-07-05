import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { StorageError, NotFoundError } from "@/lib/error";

export class TemplateModel {
  // This use a public bucket, so client can access it directly
  static async getAllTemplatesNames() {
    const supabaseClient = createSupabaseBrowserClient(false);
    const { data, error } = await supabaseClient.storage.from("resume").list();
    if (error) {
      throw new StorageError("fetching template list", error);
    }

    if (!data || data.length === 0) {
      throw new NotFoundError("Templates");
    }

    return data;
  }
}
