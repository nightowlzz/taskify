'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { updatePassword } from '@/app/action/user'
import { toast } from 'sonner'
import { Eye } from 'lucide-react'

export const updatePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: '8자 이상 입력해 주세요.',
    }),
    newPassword: z.string().min(8, {
      message: '8자 이상 입력해 주세요.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>

export const ChangePassword = () => {
  const [isShow, setIsShow] = useState(false)
  const [isShow2, setIsShow2] = useState(false)

  const [isPending, startTransition] = useTransition()

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: UpdatePasswordFormValues) => {
    startTransition(async () => {
      const { currentPassword, newPassword } = values
      try {
        await updatePassword({ password: currentPassword, newPassword })
        form.reset()
        toast.success('비밀번호 변경이 완료되었습니다.')
      } catch (error) {
        toast.error('비밀번호 변경에 실패하였습니다.')
      }
    })
  }

  const formFields: {
    name: keyof UpdatePasswordFormValues
    label: string
    placeholder: string
    type?: string
    t?: string
    onClick?: () => void
  }[] = [
    {
      name: 'currentPassword',
      label: '현재 비밀번호',
      placeholder: '현재 비밀번호를 입력해 주세요.',
    },
    {
      name: 'newPassword',
      label: '새 비밀번호',
      placeholder: '8자 이상 입력해 주세요.',
      type: isShow ? 'text' : 'password',
      t: 'password',
      onClick: () => setIsShow((value) => !value),
    },
    {
      name: 'confirmPassword',
      label: '새 비밀번호 확인',
      placeholder: '비밀번호를 한번 더 입력해 주세요.',
      type: isShow2 ? 'text' : 'password',
      t: 'password',
      onClick: () => setIsShow2((value) => !value),
    },
  ]

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-8 flex w-full flex-col gap-y-1 rounded-lg bg-white px-5 py-5 md:py-8'
      >
        {formFields.map((field, index) => (
          <FormField
            key={index}
            control={form.control}
            name={field.name}
            render={({ field: inputField }) => (
              <FormItem className='relative'>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
                {field.t === 'password' && (
                  <Eye
                    className='absolute right-2 top-8 transform cursor-pointer'
                    onClick={field.onClick}
                  />
                )}
              </FormItem>
            )}
          />
        ))}
        <div className='flex justify-end'>
          <Button
            disabled={!form.formState.isValid || isPending}
            type='submit'
            className='mt-5 px-8'
          >
            변경
          </Button>
        </div>
      </form>
    </Form>
  )
}
