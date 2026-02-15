import { z } from "zod"

const factorScoreSchema = z.object({
  score: z.number(),
  analysis: z.string(),
})

export const reunionAnalysisSchema = z.object({
  overall_probability: z.number(),
  factor_analysis: z.object({
    emotional: factorScoreSchema,
    psychological: factorScoreSchema,
    environmental: factorScoreSchema,
    other: factorScoreSchema,
  }),
  partner_psychology: z.object({
    breakup_reason_analysis: z.string(),
    personality_analysis: z.string(),
    reunion_willingness: z.string(),
  }),
  reunion_requirements: z.object({
    solution: z.string(),
    contact_timing: z.string(),
    approach_stance: z.string(),
    contact_method: z.string(),
    considerations: z.array(z.string()),
  }),
  relationship_maintenance: z.object({
    introduction: z.string(),
    tips: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
  final_advice: z.object({
    approach_method: z.string(),
    emotion_expression: z.string(),
    optimal_timing: z.string(),
  }),
})

export type ReunionAnalysis = z.infer<typeof reunionAnalysisSchema>
