const { z } = require("zod");

const recommendationParamsSchema = z.object({
  candidateId: z.string().uuid("Invalid candidate ID")
});

const recommendationQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10)
});

module.exports = {
  recommendationParamsSchema,
  recommendationQuerySchema
};