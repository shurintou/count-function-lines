function example() {
  console.log(1)
  console.log(1)
  console.log(1)
  console.log(1)
  console.log(1) /* 234 */
  console.log(1) // 123
  // console.log(1)
  console.log(1)
}


const example2 = function () {
  console.log(1)
  console.log(1)
  console.log(1)
  /* 
  1321231
  123123
  */
}

const example3 = () => {
  console.log(1)
  console.log(1)

}

obj = {
  example4: function () {
    console.log(1)
  },
  example5: () => {
    console.log(1)
    console.log(1)
    console.log(1)
    console.log(1)
  },
  nestingObj: {
    example6: function () {
      console.log(1)
      console.log(1)
      console.log(1)
      console.log(1)
    },
    example7: () => {
      console.log(1)
      console.log(1)
    }
  }
}