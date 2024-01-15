function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(item => {
        const isTextNode = typeof item === 'string' || typeof item === 'number'
        return isTextNode ? createTextNode(item) : item
      })
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
let root = null

function workLoop(deadline) {
  
  let shouldYield = false
  while(!shouldYield && nextWorkofUnit) {
    
    nextWorkofUnit = performWorkOfUnit(nextWorkofUnit)
    shouldYield = deadline.timeRemaining() < 1
    
  }

  if (!nextWorkofUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitFiber(root.child)
  // console.log('%c [ root ]-42', 'font-size:13px; background:#fb1a45; color:#ff5e89;', root)
  root = null
}

function commitFiber(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitFiber(fiber.child)
  commitFiber(fiber.sibling) 
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

function initChild(fiber, children) {
  let prevChild = null
  children.forEach((child, index) => {
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

function updateFunctionComponent(fiber) {
  let children = [fiber.type(fiber.props)]
  initChild(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    // fiber.parent.dom.append(dom)
    // 处理props
    updateProps(fiber, dom)
  }

  let children = fiber.props.children
  initChild(fiber, children)

}

function performWorkOfUnit(fiber) {
  // 创建dom
  const isFunctionComponent = typeof fiber.type === 'function'
  if (!isFunctionComponent) {
    updateHostComponent(fiber)
  } else {
    updateFunctionComponent(fiber)
  }

  // 返回下一个任务
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling 
    nextFiber = nextFiber.parent
  }

}

function render(node, container) {

  nextWorkofUnit = {
    dom: container,
    props: {
      children: [node]
    }
  }
  
  root = nextWorkofUnit
}

requestIdleCallback(workLoop)

export default {
  createElement,
  render
}