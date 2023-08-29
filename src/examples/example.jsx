import { useState, useEffect } from 'react'

const Example = () => {
    const [foo, setFoo] = useState(0)
    const addFooByOne = () => {
        // line comment
        /* 
        *
        
        * block comment 
        */
        setFoo(foo + 1)
    }

    useEffect(() => {
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