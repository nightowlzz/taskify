import TaskCard from '@/components/modal/task-card'
import TaskCardCreate from '@/components/modal/task-create'
import { TaskCardEdit } from '@/components/modal/task-edit'
import TestFile from '@/components/modal/test-file'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'

const StyleGuide = () => {
  return (
    <div className='mx-auto flex max-w-[600px] flex-col p-[30px]'>
      <h2 className='py-[30px]'>모달</h2>
      <div className='flex flex-wrap gap-5' style={{ display: 'none' }}>
        {/* 할 일 카드 */}
        <AlertDialog>
          <AlertDialogTrigger className='bg-violet_light p-3'>
            할 일 카드
          </AlertDialogTrigger>
          <TaskCard />
        </AlertDialog>
      </div>
      <div></div>
    </div>
  )
}

export default StyleGuide
