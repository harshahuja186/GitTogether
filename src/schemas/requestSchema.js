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

const reviewRequestSchema = z.object({
  params: z.object({
    status: z.enum(["accepted", "rejected"], {
      errorMap: () => ({
        message: "Status not valid",
      }),
    }),
    requestId: z.string().min(1, { message: "User ID must be present" }),
  }),
});

module.exports = { sendRequestSchema, reviewRequestSchema };

// Initial decision
// ignored	Initial decision	The user sending the request	The sender decides they are not interested in connecting with the recipient.
// interested	Initial decision	The user sending the request	The sender expresses interest in connecting with the recipient.

// Review of request
// rejected -	Review of request -	The recipient of the request -	The recipient decides they do not want to connect with the sender after reviewing the request.
// accepted -	Review of request -	The recipient of the request -	The recipient agrees to connect with the sender after reviewing the request.
