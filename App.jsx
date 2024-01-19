import React from './core/react.js'

// const App = React.createElement('div', { id: 'app' }, 'App')

let count = 5
let props = { id: 'dddddd' }
function Counter({ num }) {
  function btnClick() {
    count++
    props = {}
    console.log('[ click ] >')
    React.update()
  }
  return (
    <div {...props} >
      count: { count }
      <button onClick={ btnClick } >click</button>
    </div>
    
  )
}

let flag = false
function Content() {
  // function Foo() {
  //   return (
  //     <div>
  //       Foo
  //       <div>child1</div>
  //     </div>
  //   )
  // } 
  // const Foo = 
  //   <div>
  //     Foo
  //     <div>child1</div>
  //     <div>child2</div>
  //   </div>
  const Bar = <div>Bar</div>

  function handleClick() {
    flag = !flag
    React.update()
  }
  return (
    <div>
      <div>
      {/* { !flag ? Foo : Bar }   */}
      </div>
      { flag && Bar }
      <button onClick={ handleClick }>click</button>
    </div>
  )
}

function CounterParent() {
  return (<Counter></Counter>)
}


function App() {
  return (<div id='app'>
    App, ddd
    <div>hihihi</div>
    <Content></Content>
    {/* <Counter num={ 10 }></Counter> */}
    {/* <Counter num={ 20 }></Counter> */}
  </div>)
}

// console.log('[ App ] >', App)

// const App = <div id='app'>
//   App, ddd
//   <div>heiheihei</div>
// </div>

export default App