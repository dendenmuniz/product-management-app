import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, { message: "Name must have at least 3 characters" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must have at least 8 characters" }),
  role: z.enum(["seller", "admin", "client"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be 'seller' or 'admin'",
  }),
});
