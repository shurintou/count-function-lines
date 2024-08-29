# count-function-lines

![NodeJs](https://img.shields.io/badge/NodeJS-%5E16.0.0-green)
![babel-parser](https://img.shields.io/badge/%40babel%2Fparser-%5E7.22.5-blue)
![@vue/compiler-sfc](https://img.shields.io/badge/%40vue%2Fcompiler--sfc-%5E3.3.4-brightgreen)
![java-parser](https://img.shields.io/badge/java--parser-%5E2.0.4-orange)
![NPM](https://img.shields.io/npm/l/express)


### What is it?
This is a tool that can be used to count the number of lines in each function in every file of your project.

Try the [demo](https://shurintou.github.io/count-function-lines/), 

![](https://github.com/shurintou/count-function-lines/blob/master/docs/demo.gif?raw=true)
or import the [example](https://github.com/shurintou/count-function-lines/tree/example) project and run it at local.

![](https://github.com/shurintou/count-function-lines/blob/master/docs/example_project.gif?raw=true)

### Supporting file type
The following file types are currently supported.
`Javascript`, `Typescript`, `jsx`, `tsx`, `Vue.js(both vue2 and vue3)`, `Java`.

### About the demo
The [demo](https://shurintou.github.io/count-function-lines/) is developed by `Vue.js` and is a totally `pure-frontend` project, any codes uploaded will just be kept in the browser's memory only. 

Please check the [development branch](https://github.com/shurintou/count-function-lines/tree/demo-dev) and the [production branch](https://github.com/shurintou/count-function-lines/tree/gh-pages) for more details if you get interested.

### About the example 
The [example](https://github.com/shurintou/count-function-lines/tree/example) project is more convenient to traverse folders and count multiple files because of the browser's limitation in file system. Developers who need to refactor their codes by some `line-number-rules` can take advantage of it.
