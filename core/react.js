function createElement(type, props, ...children) {
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

let nextWorkofUnit = null

function workLoop(deadline) {
  
  let shouldYield = false
  while(!shouldYield && nextWorkofUnit) {
    
    nextWorkofUnit = performWorkOfUnit(nextWorkofUnit)
    shouldYield = deadline.timeRemaining() < 1
    
  }

  requestIdleCallback(workLoop)
}

function createDom(type) {
  return type !== 'TEXT_ELEMENT' ? document.createElement(type) : document.createTextNode('')
}

function updateProps(fiber, dom) {
  Object.keys(fiber.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = fiber.props[key]
    }
  })
}

function initChild(fiber) {
  let prevChild = null
  fiber.props.children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

function performWorkOfUnit(fiber) {
  // 创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)
    // 处理props
    updateProps(fiber, dom)
  }
  // 处理链式关系
  initChild(fiber)
  // 返回下一个任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }

  return fiber.parent?.sibling
}

function render(node, container) {

  nextWorkofUnit = {
    dom: container,
    props: {
      children: [node]
    }
  }
  
}

requestIdleCallback(workLoop)

export default {
  createElement,
  render
}