
export const factorial = function fac(n) {
    // single comment

    return n < 2 ? 1 : n * fac(n - 1);
}

export const cube = function (x) {
    /* block comment

    */
    return x * x * x;
}
