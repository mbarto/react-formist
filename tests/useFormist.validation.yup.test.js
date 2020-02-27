/*globals test, expect*/
import * as yup from "yup"
import { renderHook, act } from "@testing-library/react-hooks"
import { log } from "../src/helpers"
import useFormist from "../src/useFormist"

test("validate through options.schema", async () => {
    let schema = yup.object().shape({
        firstName: yup.string().required(),
        age: yup.number().required(),
    })

    const { result } = renderHook(() =>
        useFormist({ firstName: "" }, { schema }),
    )

    await act(() => result.current.submit())

    expect(getErrors(result).firstName).toBeDefined()
    expect(getErrors(result).age).toBeDefined()
    expect(getFieldProps("firstName", result).error).toBeDefined()
})

test("nested schema", async () => {
    let schema = yup.object().shape({
        fullName: yup.string().required(),
        address: yup.array().of(
            yup.object().shape({
                street: yup.string().required(),
                city: yup.string().required(),
            }),
        ),
    })
    const initialValues = {
        address: [{ street: "5th avenue" }, { city: "Los Angeles" }],
    }

    const { result } = renderHook(() => useFormist(initialValues, { schema }))

    await act(() => result.current.submit())

    expect(result.current.field("address.0.city").error).not.toBe("")
    expect(result.current.error("address.0.city")).not.toBe("")
    expect(result.current.errors.address[0].city).not.toBe("")
    expect(result.current.field("address.1.street").error).not.toBe("")
    expect(result.current.error("address.1.street")).not.toBe("")
    expect(result.current.errors.address[1].street).not.toBe("")
})

const getFieldProps = (fieldName, result) =>
    result.current.getFieldProps(fieldName)
const getErrors = obj => obj.current.errors
