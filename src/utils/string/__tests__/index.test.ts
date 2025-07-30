import { describe, test, expect } from 'vitest'
import { capitalize, uncapitalize, camelToKebab, kebabToCamel } from '../index'

// 正常输入
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('hello world')).toBe('Hello world')
    expect(capitalize('hELLO')).toBe('HELLO')
  })
  test('uncapitalize', () => {
    expect(uncapitalize('Hello')).toBe('hello')
    expect(uncapitalize('Hello World')).toBe('hello World')
    expect(uncapitalize('HELLO')).toBe('hELLO')
    expect(uncapitalize('a')).toBe('a')
    expect(uncapitalize('A')).toBe('a')
  })
  test('camelToKebab', () => {
    expect(camelToKebab('helloWorld')).toBe('hello-world')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel('hello-world')).toBe('helloWorld')
  })
})

// 空字符串
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize('')).toBe('')
  })
  test('uncapitalize', () => {
    expect(uncapitalize('')).toBe('')
  })
  test('camelToKebab', () => {
    expect(camelToKebab('')).toBe('')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel('')).toBe('')
  })
})

// 输入为undefined
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize(undefined)).toBe('')
  })
  test('uncapitalize', () => {
    expect(uncapitalize(undefined)).toBe('')
  })
  test('camelToKebab', () => {
    expect(camelToKebab(undefined)).toBe('')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel(undefined)).toBe('')
  })
})

// 输入为null
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize(null as any)).toBe('')
  })
  test('uncapitalize', () => {
    expect(uncapitalize(null as any)).toBe('')
  })
  test('camelToKebab', () => {
    expect(camelToKebab(null as any)).toBe('')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel(null as any)).toBe('')
  })
})

// 输入为number
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize(123 as any)).toBe('')
  })
  test('uncapitalize', () => {
    expect(uncapitalize(123 as any)).toBe('')
  })
  test('camelToKebab', () => {
    expect(camelToKebab(123 as any)).toBe('')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel(123 as any)).toBe('')
  })
})
