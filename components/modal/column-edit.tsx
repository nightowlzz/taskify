'use client'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
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
import { api } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ColumnFormValues } from './column-add'
import { ModalHead } from './components/modal-head'
import { IColumnCreate, IColumnEditOpen } from './types/modal-type'

const ColumnSchema = z.object({
  title: z
    .string()
    .nonempty({ message: '제목을 적어주세요.' })
    .min(2, {
      message: '2글자 이상 적어주세요.',
    })
    .max(15, {
      message: '15이하로 적어 주세요',
    }),
})

export const ColumnEdit = ({
  columnId,
  title,
  dashboardId,
  setOpen,
  setStep,
}: IColumnEditOpen) => {
  const router = useRouter()
  const [columnList, setColumnList] = useState<IColumnCreate[]>() // 컬럼리스트 불러오기
  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(ColumnSchema),
    mode: 'onBlur',
    defaultValues: {
      title: title,
    },
  })

  // 컬럼 중복 이름
  const checkDuplicateTitle = (title: string) => {
    if (columnList) {
      return columnList.some((column) => column.title.trim() === title.trim())
    }
    return false
  }

  const onSubmit = async (data: ColumnFormValues) => {
    const { title } = data
    if (checkDuplicateTitle(title)) {
      toast.success('중복된 이름 입니다.')
      return
    }

    try {
      await api.put(`/columns/${columnId}`, {
        title: title.trim(),
        columnId: Number(columnId),
      })
      setOpen(false)
      toast.success('컬럼명이 변경 되었습니다.')
    } catch {
      toast.success('컬럼명이 변경 되지 않았습니다..')
    } finally {
      router.refresh()
    }
  }

  useEffect(() => {
    const getColumns = async () => {
      const res = await api.get(`/columns?dashboardId=${dashboardId}`)
      const { data } = res.data
      setColumnList(data)
    }
    getColumns()
  }, [])

  return (
    <AlertDialogContent>
      <div className='px-5 py-7 md:py-8'>
        <ModalHead>컬럼 관리</ModalHead>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-medium md:text-lg'>
                    이름
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className='flex-col-reverse  items-start justify-start pt-6 md:flex-row-reverse md:items-end md:justify-between md:pt-7'>
              <div className='flex w-full items-end justify-end gap-3'>
                <AlertDialogCancel
                  className='h-10 w-full border-gray_dark3 md:h-12 md:w-[120px]'
                  onClick={() => form.reset({ title })}
                >
                  취소
                </AlertDialogCancel>
                <Button
                  className='h-10 w-full bg-violet md:h-12 md:w-[120px]'
                  disabled={!form.formState.isValid}
                >
                  변경
                </Button>
              </div>
              <Button
                variant='underline'
                className='mb-4 h-5 p-0 leading-none md:mb-0'
                onClick={() => setStep(2)}
              >
                삭제하기
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </div>
    </AlertDialogContent>
  )
}
