/*globals test, expect*/
import { log } from "../src/helpers"
import { setPath } from "../src/mapper"

test("does not mutate original", () => {
    const obj = { first: 42 }

    const result = setPath("first", 43, obj)

    expect(result === obj).toBe(false)
})

test("one level", () => {
    const obj = { first: 42 }

    const result = setPath("first", 68, obj)

    expect(result.first).toBe(68)
})

test("many levels", () => {
    const obj = { first: { second: { third: 42 } } }

    const result = setPath("first.second.third", 68, obj)

    expect(result.first.second.third).toBe(68)
})

test("many levels within an array", () => {
    const obj = { first: { second: [{ third: 42 }, { third: 68 }] } }

    const result = setPath("first.second.1.third", 99, obj)

    expect(result.first.second[1].third).toBe(99)
    expect(result.first.second[0].third).toBe(42)
    expect(result.first.second.length).toBe(2)
})

test("missing last object level", () => {
    const obj = { first: { second: {} } }

    const result = setPath("first.second.third", 68, obj)

    expect(result.first.second.third).toBe(68)
})

test("missing many object levels", () => {
    const obj = {}

    const result = setPath("first.second.third", 68, obj)

    expect(result.first.second.third).toBe(68)
})

test("missing middle array level", () => {
    const obj = {}

    const result = setPath("first.second.1.third", 68, obj)

    expect(Array.isArray(result.first.second)).toBe(true)
    expect(result.first.second[1].third).toBe(68)
})

test("missing last array level", () => {
    const obj = {}

    const result = setPath("first.second.1", 68, obj)

    expect(Array.isArray(result.first.second)).toBe(true)
    expect(result.first.second[1]).toBe(68)
})

test("missing nested array levels", () => {
    const obj = {}

    const result = setPath("first.1.2.3", 68, obj)

    expect(Array.isArray(result.first)).toBe(true)
    expect(result.first[1][2][3]).toBe(68)
})
