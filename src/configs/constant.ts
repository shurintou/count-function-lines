import { type SupportLanguages } from '@/types/index'

export const windowWidthConstant = {
    smWidth: 768,
    mdWidth: 992,
    lgWidth: 1200,
    xlWidth: 1920,
}

export const languageOptions: SupportLanguages[] = ['.js', '.ts', '.jsx', '.tsx', '.vue', '.java',]

export const displayCode =
    `// input your code and count the lines.
function hello () {
    const foo = 'Hello World!'
    // line comment
    /* 
    * block comment
    */

    console.log(foo)
}

const abs = (bar) => {
    /* 
    * blank line in block comment counts as comment.

    */
    if (bar >= 0) { /* inline comment doesn't count. */
        return bar // inline comment doesn't count.
    }
    return -bar
}
`