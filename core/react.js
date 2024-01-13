function createElementNode(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(item => typeof item === 'string' ? createTextNode(item) : item)
    }
  }
}
function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(node, container) {
  
  const dom = node.type !== 'TEXT_ELEMENT' ? document.createElement(node.type) : document.createTextNode('')
 
  Object.keys(node.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = node.props[key]
    }
  })
  
  node.props.children.forEach(item => {
    render(item, dom)
  })

  container.append(dom)
}

export default {
  createElementNode,
  render
}