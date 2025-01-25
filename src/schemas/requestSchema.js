const { z } = require("zod");

const sendRequestSchema = z.object({
  params: z.object({
    status: z.enum(["ignored", "interested", "accepted", "rejected"], {
      errorMap: () => ({
        message: "Status not valid",
      }),
    }),
    userId: z.string().min(1, { message: "User ID must be present" }),
  }),
});

module.exports = { sendRequestSchema };
