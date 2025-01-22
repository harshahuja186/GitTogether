const { z } = require("zod");

// Reusable base schema for email and password
const emailPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
});

// Signup schema (extends emailPasswordSchema with additional fields)
const signupSchema = z.object({
  body: emailPasswordSchema.extend({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),
    skills: z
      .array(z.string())
      .max(10, "Skills should not exceed 10 elements")
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Login schema (only email and password)
const loginSchema = z.object({
  body: emailPasswordSchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

module.exports = {
  signupSchema,
  loginSchema,
};
