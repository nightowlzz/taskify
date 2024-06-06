import { ColumnCreactButton } from '@/components/modal/_component/column-create-button'
import { ColumnEditButton } from '@/components/modal/_component/column-edit-button'
import { TaskCreactButton } from '@/components/modal/_component/task-create-button'
import TaskCardCreate from '@/components/modal/task-create copy'
import { TaskCardEdit } from '@/components/modal/task-edit'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api } from '@/lib/utils'

// 대쉬보드 아이디: 8739, 8757
// 대쉬보드 아이디: 8761, 8760

async function getDashboardId(id: string) {
  const res = await api.get(`/columns?dashboardId=${id}`)
  const { data } = await res.data
  return data
}

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getDashboardId(params.id)

  return (
    <div className='mx-auto flex max-w-[600px] flex-col p-[30px]'>
      <h1 className='py-[30px]'>test 페이지</h1>
      <br />
      <hr />
      <br />
      <h2 className='text-xl'>컬럼</h2>
      <br />
      <div>생성</div>

      {/* 할 일 카드 생성 */}
      <TaskCreactButton dashboardId={params.id} />

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
      <div className='flex gap-2'>
        {data
          ? data.map((data: any) => (
              <span key={data.id}>
                <ColumnEditButton
                  title={data.title}
                  columnId={Number(data.id)}
                  dashboardId={Number(params.id)}
                />
              </span>
            ))
          : null}
      </div>
    </div>
  )
}
