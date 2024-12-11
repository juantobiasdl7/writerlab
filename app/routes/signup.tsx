import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData} from "@remix-run/react";
import { createUser, createUserSession, getUserId, validateUserSession } from "~/utils/auth.server";

import { Link } from '@remix-run/react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { getInputProps, getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

// Definimos el schema de validación
const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(1, 'El nombre es requerido')
})

// Loader para redireccionar si ya hay sesión
export async function loader({ request }: LoaderFunctionArgs) {
  //await validateUserSession(request);
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return Response.json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const submission = parseWithZod(await request.formData(), { 
    schema: signupSchema 
  })

  if (submission.status !== "success") {
    return Response.json(submission.reply(), { status: 400 })
  }

  const { email, password, name } = submission.value

  try {
    const user = await createUser(email, password, name)
    return createUserSession(user.id, "/dashboard")
  } catch (error) {
    return Response.json(
      submission.reply({ 
        formErrors: ['Error al crear el usuario']
      }), 
      { status: 500 }
    )
  }
}

export default function SignupPage() {
  const actionData = useActionData<typeof action>()

  const [form, fields] = useForm({
    id: "signup-form",
    constraint: getZodConstraint(signupSchema),
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema })
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950/40 to-slate-900/60 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50">
        <CardHeader>
          <div className="flex justify-center">
            <img
              alt="WriterLab"
              src="/placeholder.svg?height=40&width=40"
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="mt-6 text-center text-2xl font-bold text-slate-50">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form className="space-y-6" method="post" {...getFormProps(form)}>
            <div>
              <label htmlFor={fields.name.id} className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <Input
                {...getInputProps(fields.name, { type: "text" })}
                className="mt-1 bg-slate-800 text-slate-50 placeholder:text-slate-400"
                placeholder="Enter your full name"
              />
              {fields.name.errors && (
                <p className="mt-2 text-sm text-red-500">{fields.name.errors.join(', ')}</p>
              )}
            </div>
            <div>
              <label htmlFor={fields.email.id} className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <Input
                {...getInputProps(fields.email, { type: "email" })}
                className="mt-1 bg-slate-800 text-slate-50 placeholder:text-slate-400"
                placeholder="Enter your email"
              />
              {fields.email.errors && (
                <p className="mt-2 text-sm text-red-500">{fields.email.errors.join(', ')}</p>
              )}
            </div>
            <div>
              <label htmlFor={fields.password.id} className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                className="mt-1 bg-slate-800 text-slate-50 placeholder:text-slate-400"
                placeholder="Create a password"
              />
              {fields.password.errors && (
                <p className="mt-2 text-sm text-red-500">{fields.password.errors.join(', ')}</p>
              )}
            </div>
            <Button type="submit" className="w-full border border-gray-600 bg-gray-500/20 hover:bg-gray-500/40">
              Sign up
            </Button>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900/50 px-2 text-slate-300">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50">
                <svg className="mr-2 h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
                <span>Google</span>
              </Button>

              <Button variant="outline" className="w-full border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50">
                <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-slate-50 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

