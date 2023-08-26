export function throttle(fn: Function, delay?: number) {
    let timer: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any) {
        if (timer) return
        timer = setTimeout(() => {
            fn.call(this, args)
            clearTimeout(timer)
            timer = 0
        }, delay ? delay : 100)
    }
}