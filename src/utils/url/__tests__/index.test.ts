import { describe, test, expect } from 'vitest'
import {
  parseUrlParams,
  buildUrl,
  parseQueryString,
  stringifyQueryParams,
  appendQueryParams,
  queryStringHelpers,
} from '../index'

describe('URL 工具函数', () => {
  describe('parseUrlParams 函数', () => {
    test('应正确解析 URL 参数', () => {
      const url = 'https://example.com/?name=John&age=30'
      const params = parseUrlParams(url)
      expect(params).toEqual({
        name: 'John',
        age: '30',
      })
    })

    test('应处理没有参数的 URL', () => {
      const url = 'https://example.com/'
      const params = parseUrlParams(url)
      expect(params).toEqual({})
    })

    test('应处理无效的 URL', () => {
      const url = 'invalid-url'
      const params = parseUrlParams(url)
      expect(params).toEqual({})
    })

    test('当未提供 URL 时，应使用 window.location.href（浏览器环境）', () => {
      // 模拟 window.location.href
      const originalWindow = global.window
      global.window = {
        ...originalWindow,
        location: {
          ...originalWindow?.location,
          href: 'https://example.com/?test=value',
        },
      } as any

      const params = parseUrlParams()
      expect(params).toEqual({ test: 'value' })

      // 恢复 window
      global.window = originalWindow
    })

    test('当未提供 URL 且不在浏览器中时，应返回空对象', () => {
      // 模拟非浏览器环境
      const originalWindow = global.window
      global.window = undefined as any

      const params = parseUrlParams()
      expect(params).toEqual({})

      // 恢复 window
      global.window = originalWindow
    })
  })

  describe('buildUrl 函数', () => {
    test('应构建包含所有组件的 URL', () => {
      const url = buildUrl({
        baseUrl: 'https://example.com',
        path: 'api/users',
        params: {
          sort: 'name',
          order: 'asc',
        },
        hash: 'top',
      })
      expect(url).toBe('https://example.com/api/users?sort=name&order=asc#top')
    })

    test('应处理带有尾部斜杠的 baseUrl', () => {
      const url = buildUrl({
        baseUrl: 'https://example.com/',
        path: 'api/users',
      })
      expect(url).toBe('https://example.com/api/users')
    })

    test('应处理带有前导斜杠的路径', () => {
      const url = buildUrl({
        baseUrl: 'https://example.com',
        path: '/api/users',
      })
      expect(url).toBe('https://example.com/api/users')
    })

    test('应处理空的 baseUrl', () => {
      const url = buildUrl({
        baseUrl: '',
        path: 'api/users',
      })
      expect(url).toBe('')
    })

    test('应处理参数中的 null 和 undefined', () => {
      const url = buildUrl({
        baseUrl: 'https://example.com',
        params: {
          valid: 'value',
          nullParam: null,
          undefinedParam: undefined,
        },
      })
      expect(url).toBe('https://example.com?valid=value')
    })

    test('应将参数附加到现有查询字符串', () => {
      const url = buildUrl({
        baseUrl: 'https://example.com?existing=param',
        params: {
          extra: 'value',
        },
      })
      expect(url).toBe('https://example.com?existing=param&extra=value')
    })
  })

  describe('parseQueryString 函数', () => {
    test('应正确解析查询字符串', () => {
      const queryString = 'name=John&age=30'
      const params = parseQueryString(queryString)
      expect(params).toEqual({
        name: 'John',
        age: '30',
      })
    })

    test('应处理带有前导问号的查询字符串', () => {
      const queryString = '?name=John&age=30'
      const params = parseQueryString(queryString)
      expect(params).toEqual({
        name: 'John',
        age: '30',
      })
    })

    test('应处理空查询字符串', () => {
      const queryString = ''
      const params = parseQueryString(queryString)
      expect(params).toEqual({})
    })

    test('应处理值中的特殊字符', () => {
      const queryString = 'search=hello%20world&filter=a+b'
      const params = parseQueryString(queryString)
      expect(params).toEqual({
        search: 'hello world',
        filter: 'a b',
      })
    })
  })

  describe('stringifyQueryParams 函数', () => {
    test('应将对象转换为查询字符串', () => {
      const params = {
        name: 'John',
        age: 30,
      }
      const queryString = stringifyQueryParams(params)
      expect(queryString).toBe('name=John&age=30')
    })

    test('应处理 null 和 undefined 值', () => {
      const params = {
        name: 'John',
        age: null,
        height: undefined,
      }
      const queryString = stringifyQueryParams(params)
      expect(queryString).toBe('name=John')
    })

    test('当 skipNull 为 false 时应包含 null 值', () => {
      const params = {
        name: 'John',
        age: null,
      }
      const queryString = stringifyQueryParams(params, { skipNull: false })
      expect(queryString).toBe('name=John&age=null')
    })

    test('当 skipEmpty 为 true 时应跳过空字符串', () => {
      const params = {
        name: 'John',
        title: '',
      }
      const queryString = stringifyQueryParams(params, { skipEmpty: true })
      expect(queryString).toBe('name=John')
    })

    test('应处理非对象参数', () => {
      const params = null as any
      const queryString = stringifyQueryParams(params)
      expect(queryString).toBe('')
    })
  })

  describe('appendQueryParams 函数', () => {
    test('应将参数附加到没有查询字符串的 URL', () => {
      const url = 'https://example.com'
      const params = {
        name: 'John',
        age: 30,
      }
      const result = appendQueryParams(url, params)
      expect(result).toBe('https://example.com?name=John&age=30')
    })

    test('应将参数附加到带有现有查询字符串的 URL', () => {
      const url = 'https://example.com?existing=param'
      const params = {
        name: 'John',
      }
      const result = appendQueryParams(url, params)
      expect(result).toBe('https://example.com?existing=param&name=John')
    })

    test('应处理空 URL', () => {
      const url = ''
      const params = {
        name: 'John',
      }
      const result = appendQueryParams(url, params)
      expect(result).toBe('')
    })

    test('应处理空参数', () => {
      const url = 'https://example.com'
      const params = {}
      const result = appendQueryParams(url, params)
      expect(result).toBe('https://example.com')
    })

    test('应处理 null 参数', () => {
      const url = 'https://example.com'
      const params = null as any
      const result = appendQueryParams(url, params)
      expect(result).toBe('https://example.com')
    })
  })

  describe('queryStringHelpers 对象', () => {
    test('应暴露正确的方法', () => {
      expect(queryStringHelpers.parse).toBe(parseQueryString)
      expect(queryStringHelpers.stringify).toBe(stringifyQueryParams)
      expect(queryStringHelpers.append).toBe(appendQueryParams)
    })
  })
})
