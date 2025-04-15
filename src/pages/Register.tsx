
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import RegisterFormHeader from "@/components/auth/RegisterFormHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define schema for the form
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  userType: z.enum(["it_professional", "admin"]),
  department: z.string().optional(),
  position: z.string().optional(),
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "it_professional",
      department: "",
      position: "",
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <RegisterFormHeader />
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <RegisterForm form={form} />
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
