import { z } from 'zod'

import { isValidOf } from './isValidOf'

describe(isValidOf, () => {
  describe('Matching Zod schemas', () => {
    test.each([
      [z.string(), 'a'],
      [z.number(), 0],
      [z.boolean(), true],
      [z.undefined(), undefined],
      [z.null(), null],
      [z.unknown(), 'a'],
      [z.function(), () => {}],
      [z.object({}), { a: 0 }],
      [z.array(z.string()), ['a']],
      [z.enum(['a', 'b']), 'a'],
    ])('isValidOf(%p) === true', (schema, value) => {
      expect(isValidOf(schema, value)).toBeTruthy()
    })
  })
  describe('Not matching Zod schemas', () => {
    test.each([
      [z.string(), 0],
      [z.number(), '0'],
      [z.boolean(), 'true'],
      [z.undefined(), null],
      [z.null(), undefined],
      [z.function(), 'a'],
      [z.object({}), ['a']],
      [z.array(z.string()), [0]],
      [z.enum(['a', 'b']), 'c'],
    ])('isValidOf(%p) === false', (schema, value) => {
      expect(isValidOf(schema, value)).toBeFalsy()
    })
  })
})
