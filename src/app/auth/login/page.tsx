'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const loginSchema = z.object({
  email: z.string().email('Будь ласка, введіть дійсну адресу електронної пошти'),
  password: z.string().min(6, 'Пароль має містити щонайменше 6 символів'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setError(null)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (res?.error) {
        setError('Неправильний логін або пароль. Будь ласка, спробуйте ще раз.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Сталася непередбачувана помилка.')
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="flex justify-center items-center gap-4 group mb-10">
          <div className="w-14 h-14 rounded-sm bg-[#CCFF00] flex items-center justify-center border border-[#CCFF00]">
            <Trophy className="w-7 h-7 text-black" />
          </div>
          <span className="text-4xl font-black text-white tracking-tight uppercase">FOOTBALLIUM</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white uppercase">
          Вхід
        </h2>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Увійдіть, щоб отримати доступ до панелі управління команди
        </p>
      </div>

      <div className="relative mt-10 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Card className="bg-[#1c1a1a] border-gray-800 rounded-sm shadow-2xl">
          <CardContent className="pt-10 sm:px-12">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest leading-6 text-gray-500 mb-2">
                  Електронна пошта
                </label>
                <div className="mt-2">
                  <Input
                    {...register('email')}
                    type="email"
                    className="bg-[#0a0a0a] border-gray-800 focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] transition-all text-white py-6 rounded-sm font-bold placeholder:text-gray-700"
                    placeholder="coach@functional.app"
                  />
                  {errors.email && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest leading-6 text-gray-500 mb-2">
                  Пароль
                </label>
                <div className="mt-2">
                  <Input
                    {...register('password')}
                    type="password"
                    className="bg-[#0a0a0a] border-gray-800 focus-visible:ring-[#CCFF00] focus-visible:border-[#CCFF00] transition-all text-white py-6 rounded-sm font-bold placeholder:text-gray-700"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded-sm border-gray-800 bg-[#0a0a0a] text-[#CCFF00] focus:ring-[#CCFF00] focus:ring-offset-[#1c1a1a]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Запам'ятати мене
                </label>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">
                <a href="#" className="text-[#CCFF00] hover:text-white transition-colors">
                  Забули пароль?
                </a>
              </div>
            </div>

              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#CCFF00] hover:bg-[#b3ff00] text-black py-8 rounded-sm font-black uppercase tracking-widest text-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  Увійти до панелі управління
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-900" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest leading-6">
                  <span className="bg-[#1c1a1a] px-6 text-gray-600">Демо-дані для входу</span>
                </div>
              </div>
              <div className="mt-6 text-[10px] text-gray-500 text-center bg-[#0a0a0a] rounded-sm p-4 border border-gray-800 font-bold uppercase tracking-widest">
                <p className="mb-1">Email: <span className="text-[#CCFF00] font-black tracking-normal ml-2">coach@functional.app</span></p>
                <p>Пароль: <span className="text-[#CCFF00] font-black tracking-normal ml-2">Coach123!</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
