/*globals test, expect*/
import { last } from "../src/helpers"
import { getPath } from "../src/mapper"

const deepClone = obj => JSON.parse(JSON.stringify(obj))

const setPath = (path, value, obj) => {
    const newObj = deepClone(obj)

    const parts = path.split(".")
    const partsMinusLast = parts.slice(0, -1)
    let current = newObj
    partsMinusLast.forEach(part => {
        if (!current[part]) current[part] = {}
        current = current[part]
    })
    current[last(parts)] = value

    return newObj
}

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

test("last level missing", () => {
    const obj = { first: { second: {} } }

    const result = setPath("first.second.third", 68, obj)

    expect(result.first.second.third).toBe(68)
})

test("many levels missing", () => {
    const obj = {}

    const result = setPath("first.second.third", 68, obj)

    expect(result.first.second.third).toBe(68)
})
