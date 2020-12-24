import request from '@/utils/request'
import { AxiosResponse } from 'axios'

export function fileDelete(file_id: string): void {
  request({
    url: `/files/${file_id}`,
    method: 'delete'
  })
}

export async function filePost(file: File) {
  // const formData = new FormData()
  // formData.append('file_name', file.name)
  const data = {
    file_name: file.name,
    file_type: file.type
  }
  const resp: AxiosResponse['data'] = await request({
    url: '/files',
    method: 'post',
    params: data
  })
  if (resp) {
    return resp
  }
  return ''
}
