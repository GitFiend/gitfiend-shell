import {parsePort} from './parse-port'

describe('parsePort', () => {
  it('returns null if port is not found', () => {
    const result = parsePort('hello')
    expect(result).toBe(null)
  })

  it('returns the port number', () => {
    const result = parsePort('PORT: 1234')
    expect(result).toBe(1234)
  })

  it('returns the port number if there is other text before', () => {
    const result = parsePort('hello PORT: 1234')
    expect(result).toBe(1234)
  })

  it('returns the port number if there is other text after', () => {
    const result = parsePort('a PORT: 1234 hello')
    expect(result).toBe(1234)
  })
})
