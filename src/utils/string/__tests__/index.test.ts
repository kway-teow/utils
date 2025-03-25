import { describe, test, expect } from 'vitest'
import { capitalize, camelToKebab, kebabToCamel } from '../index'

// 正常输入
describe('string', () => {
  test('capitalize', () => {
    expect(capitalize('hello')).toBe('Hello')
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
  test('camelToKebab', () => {
    expect(camelToKebab(123 as any)).toBe('')
  })
  test('kebabToCamel', () => {
    expect(kebabToCamel(123 as any)).toBe('')
  })
})
