import request from '@/utils/request'
import { AxiosResponse } from 'axios'

export function fileDelete(file_id: string): void {
  request({
    url: `/files/${file_id}`,
    method: 'delete'
  })
}

export async function filePost(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const resp: AxiosResponse['data'] = await request({
    url: '/files',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  })
  if (typeof resp === 'object' && typeof resp.file_name === 'string') {
    return resp.file_name
  }
  return ''
}
