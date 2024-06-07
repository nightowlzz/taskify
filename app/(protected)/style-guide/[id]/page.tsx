import { ColumnCreactButton } from '@/components/modal/components/column-create-button'
import { ColumnEditButton } from '@/components/modal/components/column-edit-button'
import { TaskCreactButton } from '@/components/modal/components/task-create-button'
import { TaskCardEdit } from '@/components/modal/task-edit'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api } from '@/lib/utils'
import { TaskList } from './task-list'

async function getDashboardId(id: number) {
  const res = await api.get(`/columns?dashboardId=${id}`)
  const { data } = await res.data
  return data
}
// 추 후 삭제예정[파일]
export default async function Page({ params }: { params: { id: number } }) {
  const data = await getDashboardId(params.id)

  return (
    <div className='mx-auto flex max-w-[1000px] flex-col p-[30px]'>
      <h1 className='py-[30px]'>test 페이지</h1>
      <br />
      <hr />
      <br />
      <h2 className='text-xl'>컬럼</h2>
      <br />
      <div>생성</div>

      <br />
      <div>수정</div>
      {/* 할 일 카드 수정 */}
      <AlertDialog>
        <AlertDialogTrigger className='bg-violet_light p-3'>
          할 일 카드 수정
        </AlertDialogTrigger>
        <TaskCardEdit />
      </AlertDialog>
      <br />
      <hr />
      <br />
      <h2 className='text-xl'>컬럼</h2>
      <br />
      <div>생성</div>
      <ColumnCreactButton dashboardId={params.id} />
      <br />
      <div>수정</div>
      <ul className='flex gap-2'>
        {data
          ? data.map((data: any) => (
              <li key={data.id}>
                <ColumnEditButton
                  title={data.title}
                  columnId={Number(data.id)}
                  dashboardId={Number(params.id)}
                />
                <br />
                <hr />
                <br />
                <TaskCreactButton
                  dashboardId={Number(params.id)}
                  columnId={Number(data.id)}
                />
                <br />
                <hr />
                <br />
                <div>[할일]</div>
                <TaskList columnId={Number(data.id)} />
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}