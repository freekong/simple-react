import React from './react.js'

const reactDOM = {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container)
      } 
    }
  }
}

export default reactDOM