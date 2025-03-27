import { z } from "zod"

//Package Zod ini untuk validasi form
export const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6, {
        message:"Password must be at least 6 characters"
    })
});

export type LoginSchema = z.infer<typeof loginSchema>;