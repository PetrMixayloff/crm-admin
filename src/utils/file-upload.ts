import request from '@/utils/request'
import { AxiosResponse } from 'axios'

export function fileDelete(fileName: string): void {
  request({
    url: `/files/${fileName}`,
    method: 'delete'
  })
}

export async function filePost(file: File) {
  const data = {
    file_name: file.name,
    file_type: file.type
  }
  const resp: AxiosResponse['data'] = await request({
    url: '/files/',
    method: 'post',
    params: data
  })
  if (resp) {
    return resp
  }
  return ''
}
