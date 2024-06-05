'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api, cn } from '@/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { ChangeEvent, KeyboardEvent, memo, useEffect, useState } from 'react'
import { toast } from 'sonner'
import style from './modal.module.css'

const IMAGE_ADD_ICON = '/icon-purple-add.svg'

interface IMember {
  id: number
  email: string
  nickname: string
  profileImageUrl: string
  createdAt: string
  updatedAt: string
}

interface IMembers {
  members: IMember[]
  totalCount: number
}

interface ITaskCreate {
  id: number
  title: string
  description: string
  tags: [string]
  dueDate: string
  assignee: {
    profileImageUrl: string
    nickname: string
    id: number
  }
  imageUrl: string
  teamId: string
  columnId: number
  createdAt: string
  updatedAt: string
}

const FormSchema = z.object({
  manager: z.string().nonempty({
    message: '담장자를 선택해 주세요',
  }),
  title: z.string().nonempty({
    message: '제목을 입력해 주세요',
  }),
  desc: z
    .string()
    .min(5, { message: '5자 이상 작성해 주세요' })
    .max(300, { message: '300자 이내로 적어주세요' }),
  dueDate: z.date().min(new Date('1900-01-01')),
  tags: z.array(z.string(), { message: '하나 이상의 태그 필수 입니다' }),
  image: z.string().optional(),
})

// 맴버들
export const getUsers = async (id: number) => {
  const {
    data: { members },
  } = await api.get<IMembers>(`/members?dashboardId=${id}`)

  return members
}

// tag save
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)

  return `${r},${g},${b}`
}

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer()

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image),
  )

  const files = dataTransfer.files
  const displayUrl = URL.createObjectURL(event.target.files![0])

  return { files, displayUrl }
}

const TaskCardCreate = () => {
  const [users, setUsers] = useState<IMember[]>()
  const [preview, setPreview] = useState<string>('')
  const [tagAdd, setTagAdd] = useState<string>('')
  const [tagList, setTagList] = useState<string[]>()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onBlur',
    defaultValues: {
      manager: '',
      title: '',
      desc: '',
      dueDate: new Date(),
      tags: [],
      image: '',
    },
  })

  // tag
  const handleTagList = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!tagAdd) return

    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = `${tagAdd}-#${getRandomColor()}`

      setTagList((prev) => (prev ? [...prev, newTag] : [newTag]))
      form.setValue('tags', [...form.getValues('tags'), newTag])
      setTagAdd('')
    }
  }

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setTagAdd(value)
  }

  // image

  // 이미지 미리보기
  // const getImageData = () => {
  //   const image = form.image
  //   const url = URL.createObjectURL(e.target.files![0])
  //   return url
  // }
  // const handleImageChange = (e: any) => {
  //   const url = getImageData(e)
  //   setPreview(url)
  // }

  // test id

  // 대쉬보드ID: 8689,
  // 컬럼ID: 29348, 29349, 29350

  // 대쉬보드ID: 8689
  // 컬럼ID: 29206, 29207, 29208

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const assigneeUserId = parseInt(data.manager, 10)
    const dueDateFormatted = format(data.dueDate, 'yyyy-MM-dd HH:mm')
    const imageUrlFormatted = data.image?.split('blob:')[0]
    const requestData = {
      assigneeUserId,
      dashboardId: 8735, // 임시
      columnId: 29348, // 임시
      title: data.title,
      description: data.desc,
      dueDate: dueDateFormatted,
      tags: data.tags,
      imageUrl:
        'https://sprint-fe-project.s3.ap-northeast-2.amazon…/taskify/profile_image/5-1_3562_1717314829233.png',
    }
    console.log('폼 전송>>', data)
    try {
      const res = await api.post('/cards', requestData)
      const resData: ITaskCreate = res.data
      console.log('resData=>>', resData)
      toast.success('전송 완료')
    } catch {
      toast.success('전송 실패')
    }
  }

  useEffect(() => {
    const getMembers = async () => {
      const user = await getUsers(8735)
      setUsers(user)
    }
    getMembers()
  }, [])

  return (
    <AlertDialogContent className='block h-[90vh] max-w-[506px] md:max-h-[80vh]'>
      <ScrollArea className='h-full w-full'>
        <div className='px-5 pb-[100px] pt-7 md:pb-[136px] md:pt-8'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-6'
            >
              {/* 담당자 */}
              <FormField
                control={form.control}
                name='manager'
                render={({ field }) => (
                  <FormItem className='w-[218px] flex-1'>
                    <FormLabel className='text-base font-bold md:text-lg'>
                      담당자
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='이름을 입력해 주세요' />
                        </SelectTrigger>
                      </FormControl>
                      {/* server component */}
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={`${user.id}`}>
                            <div className='flex items-center'>
                              <Avatar className='mr-2'>
                                <AvatarImage src={user.profileImageUrl} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span className='text-sm'>{user.nickname}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 제목 */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='md:pt-2'>
                    <FormLabel className='text-base font-bold md:text-lg'>
                      제목 <sup className='text-ms text-[#5534DA]'>*</sup>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='제목을 입력해 주세요' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 설명 */}
              <FormField
                control={form.control}
                name='desc'
                render={({ field }) => (
                  <FormItem className='md:pt-2'>
                    <FormLabel className='text-base font-bold md:text-lg'>
                      설명 <sup>*</sup>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='설명을 입력해 주세요'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 마감일 */}
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='text-base font-bold md:text-lg'>
                      마감일 <sup>*</sup>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type='button'
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start pl-3 font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <Image
                              className='mr-2'
                              src='/icon-calendar.svg'
                              width={20}
                              height={20}
                              alt='달력'
                            />
                            {field.value ? (
                              format(field.value, 'yyyy년 M월 d일 h:mm')
                            ) : (
                              <span>날짜를 입력해 주세요.</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 태그 추가 */}
              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem className='md:pt-2'>
                    <FormLabel className='text-base font-bold md:text-lg'>
                      태그
                    </FormLabel>
                    <div className='border-1 flex min-h-12 flex-wrap items-center gap-2 rounded-md border px-2 py-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        {tagList
                          ? tagList.map((tag, i) => (
                              <Button
                                key={tag.split('-#')[0] + i}
                                className={`h-auto min-h-6 text-wrap rounded p-1.5 text-left text-xs font-medium`}
                                style={{
                                  backgroundColor: `rgba(${tag.split('-#')[1]},0.5)`,
                                }}
                                variant={'outline'}
                              >
                                {tag.split('-#')[0]}
                              </Button>
                            ))
                          : null}
                      </div>
                      <FormControl>
                        <Input
                          type='text'
                          className='h-6 max-w-[180px] border-0 px-1 outline-0'
                          value={tagAdd}
                          placeholder={
                            tagAdd.length
                              ? '입력 후 엔터'
                              : '태그를 입력해 주세요'
                          }
                          onChange={(e) => handleTagChange(e)}
                          onKeyDown={(e) => handleTagList(e)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div> 파일</div>
              <input type='file' width={100} className='border' />
              <div> 파일</div> */}
              {/* 이미지 추가 */}
              {/* <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem className='md:pt-2'>
                    <div className='flex'>
                      <FormControl>
                        <Input
                          id='picture'
                          type='file'
                          accept='.jpg,.png,.jpeg,.png,.svg'
                          className={`${style.inputFile}`}
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor='picture'
                        className={`${style.failLabel} relative flex h-[76px] w-[76px] cursor-pointer items-center justify-center rounded-md bg-[#f5f5f5] bg-center bg-no-repeat`}
                        style={{
                          backgroundSize: preview ? '100% auto' : 'auto auto',
                          backgroundImage: preview
                            ? `url(${preview})`
                            : `url(${IMAGE_ADD_ICON})`,
                        }}
                      ></FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='image'
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    <FormItem>
                      <FormLabel>Circle Image</FormLabel>
                      <FormControl>
                        <Input
                          id='picture'
                          type='file'
                          {...rest}
                          onChange={(event) => {
                            const { files, displayUrl } = getImageData(event)
                            setPreview(displayUrl)
                            onChange(files)
                          }}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor='picture'
                        className={`${style.failLabel} relative flex h-[76px] w-[76px] cursor-pointer items-center justify-center rounded-md bg-[#f5f5f5] bg-center bg-no-repeat`}
                        style={{
                          backgroundSize: preview ? '100% auto' : 'auto auto',
                          backgroundImage: preview
                            ? `url(${preview})`
                            : `url(${IMAGE_ADD_ICON})`,
                        }}
                      ></FormLabel>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <AlertDialogFooter className='absolute bottom-0 left-0 flex w-full gap-3 bg-white px-5 pb-7 pt-6 md:justify-end md:p-7'>
                <AlertDialogCancel className='h-10 w-full border-gray_dark3 md:h-12 md:w-[120px]'>
                  취소
                </AlertDialogCancel>
                <button
                  type='submit'
                  className='h-10 w-full bg-violet md:h-12 md:w-[120px]'
                >
                  생성
                </button>
                {/* <AlertDialogAction
                  type='submit'
                  className='h-10 w-full bg-violet md:h-12 md:w-[120px]'
                  disabled={!form.formState.isValid}
                >
                  생성
                </AlertDialogAction> */}
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </AlertDialogContent>
  )
}

export default memo(TaskCardCreate)
