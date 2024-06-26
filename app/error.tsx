'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div>
      <div className='flex h-[100vh] flex-col flex-col items-center justify-center'>
        <h2 className='text-gray_dark1 text-7xl font-bold md:text-8xl'>
          ERROR
        </h2>
        <h1 className='text-gray_dark1 pb-2 pt-8 text-center font-bold md:text-2xl'>
          에러가 발생하였습니다.
        </h1>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Button
            asChild
            variant={'p_btn'}
            className='h-auto rounded-lg bg-[#5534DA] px-5 py-3 text-base font-bold text-white hover:bg-[#5534DA]/70 md:px-6 md:py-4'
          >
            <Link href='/'>처음으로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
