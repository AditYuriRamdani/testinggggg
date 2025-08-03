import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(1, { message: "Password harus diisi." }),
});

export const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(8, { message: "Password minimal 8 karakter." }),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
