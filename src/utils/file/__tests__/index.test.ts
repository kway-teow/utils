import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchFileContent, downloadFile } from '../index'

// Mock fetch globally
global.fetch = vi.fn()

// Mock URL and document objects for downloadFile
global.URL = {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
} as any

global.URL.prototype = {
  pathname: '/path/file.txt',
} as any

// Mock document elements and methods
global.document = {
  createElement: vi.fn(),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
} as any

describe('fetchFileContent', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should successfully fetch text content', async () => {
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('file content'),
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const content = await fetchFileContent('https://example.com/file.txt')

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.txt', { headers: {} })
    expect(content).toBe('file content')
  })

  test('should successfully fetch binary content', async () => {
    const arrayBuffer = new ArrayBuffer(8)
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('file content'),
      arrayBuffer: vi.fn().mockResolvedValue(arrayBuffer),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const content = await fetchFileContent('https://example.com/file.bin', { responseType: 'arraybuffer' })

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.bin', { headers: {} })
    expect(content).toBe(arrayBuffer)
  })

  test('should use custom headers when provided', async () => {
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('file content'),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await fetchFileContent('https://example.com/file.txt', {
      headers: { Authorization: 'Bearer token' },
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/file.txt',
      { headers: { Authorization: 'Bearer token' } },
    )
  })

  test('should handle HTTP errors', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(fetchFileContent('https://example.com/notfound.txt'))
      .rejects.toBe('HTTP error! Status: 404')
  })

  test('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(fetchFileContent('https://example.com/file.txt'))
      .rejects.toBe('获取远程文件失败: Network error')
  })

  test('should handle non-Error type errors', async () => {
    global.fetch = vi.fn().mockRejectedValue('Unknown error')

    await expect(fetchFileContent('https://example.com/file.txt'))
      .rejects.toBe('获取远程文件失败: Unknown error')
  })

  test('should handle empty URL parameter', async () => {
    await expect(fetchFileContent('')).rejects.toContain('获取远程文件失败')
  })

  test('should handle invalid URL parameter', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Invalid URL'))

    await expect(fetchFileContent('invalid-url'))
      .rejects.toBe('获取远程文件失败: Invalid URL')
  })

  test('should handle undefined options parameter', async () => {
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('file content'),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await fetchFileContent('https://example.com/file.txt', undefined)

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.txt', { headers: {} })
  })

  test('should handle null options parameter', async () => {
    const mockResponse = {
      ok: true,
      text: vi.fn().mockResolvedValue('file content'),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await fetchFileContent('https://example.com/file.txt', null as any)

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/file.txt', { headers: {} })
  })

  test('should handle response timeout', async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 100)
      })
    })

    await expect(fetchFileContent('https://example.com/file.txt'))
      .rejects.toBe('获取远程文件失败: Request timeout')
  })
})

describe('downloadFile', () => {
  const mockLink = {
    href: '',
    download: '',
    click: vi.fn(),
  }

  beforeEach(() => {
    vi.resetAllMocks()

    // Mock document.createElement to return a link element
    document.createElement = vi.fn().mockReturnValue(mockLink)

    // Mock URL.createObjectURL
    URL.createObjectURL = vi.fn().mockReturnValue('blob:url')

    // Mock response's blob method
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue('blob-data'),
    })

    // Mock URL constructor
    global.URL = class MockURL {
      pathname: string

      constructor(url: string) {
        this.pathname = url.includes('/path/file.txt')
          ? '/path/file.txt'
          : url.includes('/file.txt')
            ? '/file.txt'
            : '/'
      }

      static createObjectURL = vi.fn().mockReturnValue('blob:url')
      static revokeObjectURL = vi.fn()
    } as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should download file with auto-generated filename', async () => {
    await downloadFile('https://example.com/path/file.txt')

    expect(global.fetch).toHaveBeenCalledWith('https://example.com/path/file.txt')
    expect(URL.createObjectURL).toHaveBeenCalledWith('blob-data')
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe('blob:url')
    expect(mockLink.download).toBe('file.txt')
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
    expect(mockLink.click).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url')
  })

  test('should download file with specified filename', async () => {
    await downloadFile('https://example.com/file.txt', 'custom-name.txt')

    expect(mockLink.download).toBe('custom-name.txt')
  })

  test('should handle HTTP errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(downloadFile('https://example.com/notfound.txt'))
      .rejects.toBe('HTTP error! Status: 404')
  })

  test('should handle network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(downloadFile('https://example.com/file.txt'))
      .rejects.toBe('下载文件失败: Network error')
  })

  test('should handle cases when filename cannot be extracted', async () => {
    await downloadFile('https://example.com/')

    expect(mockLink.download).toBe('downloaded-file')
  })

  test('should handle empty URL parameter', async () => {
    await expect(downloadFile('')).rejects.toContain('下载文件失败')
  })

  test('should handle browser not supporting blob', async () => {
    const mockResponse = {
      ok: true,
      blob: vi.fn().mockRejectedValue(new Error('Blob not supported')),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    await expect(downloadFile('https://example.com/file.txt'))
      .rejects.toBe('下载文件失败: Blob not supported')
  })

  test('should handle URL.createObjectURL failure', async () => {
    URL.createObjectURL = vi.fn().mockImplementation(() => {
      throw new Error('Cannot create object URL')
    })

    await expect(downloadFile('https://example.com/file.txt'))
      .rejects.toBe('下载文件失败: Cannot create object URL')
  })

  test('should handle element creation failure', async () => {
    document.createElement = vi.fn().mockImplementation(() => {
      throw new Error('Cannot create element')
    })

    await expect(downloadFile('https://example.com/file.txt'))
      .rejects.toBe('下载文件失败: Cannot create element')
  })

  test('should handle null filename parameter', async () => {
    await downloadFile('https://example.com/file.txt', null as any)

    expect(mockLink.download).toBe('file.txt')
  })

  test('should handle undefined filename parameter', async () => {
    await downloadFile('https://example.com/file.txt', undefined)

    expect(mockLink.download).toBe('file.txt')
  })
})
