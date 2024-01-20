import React from './core/react.js'

function Foo() {
  console.log('=======> foo run')
  const [count, setCount] = React.useState(5)
  const [name, setName] = React.useState('djh')
  function fooClick() {
    setCount((a) => a + 1)
    setName(n => n + '-')
  }

  React.useEffect(() => {
    console.log('init ======')
    return () => {
      console.log('clearup 0')
    }
  }, [])

  React.useEffect(() => {
    console.log('update ======', count)
    return () => {
      console.log('clearup 1')
    }
  }, [count])

  return (
    <div>
      <div>{name}</div>
      <div>{count}</div>
      <button onClick={ fooClick }>foo click</button>
    </div>
  )
}

function App() {
  console.log('=======> App run')
  return (<div id='app'>
    App
    <div>
      <Foo></Foo>
    </div>
  </div>)
}


export default App