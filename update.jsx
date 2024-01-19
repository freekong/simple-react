import React from './core/react.js'

let fooCount = 0
let barCount = 0
function Foo() {
  console.log('=======> foo run')
  const update = React.update()
  function fooClick() {
    fooCount++
    update()
  }
  return (
    <div>
      <button onClick={ fooClick }>foo click</button>{fooCount}
    </div>
  )
}

function Bar() {
  console.log('=======> bar run')
  const update = React.update()
  function barClick() {
    barCount++
    update()
  }
  return (
    <div>
      <button onClick={ barClick }>bar click</button>{barCount}
      <Son></Son>
    </div>
  )
}

let sonCount = 0
function Son() {
  console.log('=======> son run')
  const update = React.update()
  function sonClick() {
    sonCount++
    update()
  }
  return (
    <div>
      <button onClick={ sonClick }>son click</button>{sonCount}
    </div>
  )
}

let appCount = 0
function App() {
  console.log('=======> App run')
  const update = React.update()
  function appClick() {
    appCount++
    update()
  }
  return (<div id='app'>
    App
    <div>{ appCount }</div>
    <button onClick={ appClick }>click</button>
    <div>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  </div>)
}


export default App