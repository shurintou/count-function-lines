# count-function-lines

![NodeJs](https://img.shields.io/badge/NodeJS-%5E16.0.0-green)
![babel-parser](https://img.shields.io/badge/%40babel%2Fparser-%5E7.22.5-blue)
![@vue/compiler-sfc](https://img.shields.io/badge/%40vue%2Fcompiler--sfc-%5E3.3.4-brightgreen)
![java-parser](https://img.shields.io/badge/java--parser-%5E2.0.4-orange)
![NPM](https://img.shields.io/npm/l/express)


### What is it?
This is a tool that helps you count lines number of each function in your files, and this is project is an example which can run in local environment.

### Supporting file type
The following file types are currently supported.
`Javascript`, `Typescript`, `jsx`, `tsx`, `Vue.js(both vue2 and vue3)`, `Java`.

### How to use?
At the very beginning, make sure your `Node.js` version is at least `16.0.0`. Then,
1. Fork this project to your local environment.
2. Run `npm install` to install dependencies.
3. Set `targetPath` at the `config.js`.
4. Run `npm start` to count the function lines of files under the `targetPath`.
5. Get the result stored at `ouputResultFilePath`.
