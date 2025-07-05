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

export const ContentSchema = z.object({
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
});

export const ResumeSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  template_url: z.string().optional(),
  created_at: z.string().optional(),
  last_updated_at: z.string().optional(),
  user_updated_at: z.string().datetime({ offset: true }),
  content: ContentSchema,
});

export type IResume = z.infer<typeof ResumeSchema>;
export type IContent = z.infer<typeof ContentSchema>;
