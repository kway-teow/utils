/**
 * 从远程URL获取文件内容
 * @param url 文件的URL地址
 * @param options 请求选项（可选）
 * @returns Promise<string | ArrayBuffer> 文件内容（文本或二进制数据）
 */
export async function fetchFileContent(
  url: string,
  options?: {
    responseType?: 'text' | 'arraybuffer'
    headers?: Record<string, string>
  },
): Promise<string | ArrayBuffer> {
  // 验证 URL 不为空
  if (!url) {
    return Promise.reject('获取远程文件失败: URL不能为空')
  }

  const { responseType = 'text', headers = {} } = options || {}

  try {
    const response = await fetch(url, { headers })

    if (!response.ok) {
      return Promise.reject(`HTTP error! Status: ${response.status}`)
    }

    if (responseType === 'arraybuffer') {
      return await response.arrayBuffer()
    }
    else {
      return await response.text()
    }
  }
  catch (error) {
    return Promise.reject(
      `获取远程文件失败: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
   * 从远程URL下载文件并保存
   * @param url 文件的URL地址
   * @param filename 保存的文件名
   */
export async function downloadFile(url: string, filename?: string): Promise<void> {
  // 验证 URL 不为空
  if (!url) {
    return Promise.reject('下载文件失败: URL不能为空')
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return Promise.reject(`HTTP error! Status: ${response.status}`)
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = filename || new URL(url).pathname.split('/').pop() || 'downloaded-file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
  catch (error) {
    return Promise.reject(
      `下载文件失败: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
