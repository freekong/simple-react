import React from './core/react.js'

// const App = React.createElement('div', { id: 'app' }, 'App')

function Counter({ num }) {
  return (
    <div>count: {num}</div>
  )
}

function CounterParent() {
  return (<Counter></Counter>)
}

function App() {
return (<div id='app'>
  App, ddd
  <div>hihihi</div>
  <Counter num={ 10 }></Counter>
  <Counter num={ 20 }></Counter>
</div>)
}

export default App