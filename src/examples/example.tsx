import { useState, useEffect } from 'react'

const Example = () => {
    const [foo, setFoo] = useState<number>(0)
    const addFooByOne = () => setFoo(foo + 1)

    useEffect(() => {
        // line comment
        /* block comment */
        setFoo(1)
    }, [])

    return (
        <div>
            <span>{foo}</span>
            <button onClick={addFooByOne}></button>
        </div>
    )
}

export default Example