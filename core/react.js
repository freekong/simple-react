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
let currentRoot = null
let wipRoot = null
let deletion = []
let wipFiber = null

function workLoop(deadline) {
  
  let shouldYield = false
  while(!shouldYield && nextWorkofUnit) {
    
    nextWorkofUnit = performWorkOfUnit(nextWorkofUnit)
    if (wipRoot?.sibling?.type === nextWorkofUnit?.type) {
      nextWorkofUnit = undefined
    }
    shouldYield = deadline.timeRemaining() < 1
    
  }

  if (!nextWorkofUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  deletion.forEach(commitDeletion)
  commitFiber(wipRoot.child)
  // console.log('%c [ root ]-42', 'font-size:13px; background:#fb1a45; color:#ff5e89;', root)
  currentRoot = wipRoot
  wipRoot = null
  deletion = []
}

function commitDeletion(fiber) {

  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    // console.log('%c [ fiber ]-57', 'font-size:13px; background:#f74579; color:#ff89bd;', fiber)
    commitDeletion(fiber.child)
  }




}

function commitFiber(fiber) {
  if (!fiber) return

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === 'init') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitFiber(fiber.child)
  commitFiber(fiber.sibling) 
}

function createDom(type) {
  return type !== 'TEXT_ELEMENT' ? document.createElement(type) : document.createTextNode('')
}

function updateProps(dom, nextProps, prevProps) {
  // old 有 new 没有 删除掉

  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // old 有 new 有 更新
  // old 没有 new 有 新增

  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] != prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          child: null,
          sibling: null,
          dom: null,
          effectTag: 'init'
        }
      }

      if (oldFiber) {
        // console.log('%c [ oldFiber ]-137', 'font-size:13px; background:#397025; color:#7db469;', oldFiber)
        
        deletion.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (child) {
      prevChild = newFiber
    }
  })
  while (oldFiber) {
    console.log('[ oldFiber ] >', oldFiber)
    deletion.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  let children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    // fiber.parent.dom.append(dom)
    // 处理props
    updateProps(dom, fiber.props, {})
  }

  let children = fiber.props.children
  reconcileChildren(fiber, children)

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

  wipRoot = {
    dom: container,
    props: {
      children: [node]
    }
  }
  
  nextWorkofUnit = wipRoot
}

function update() {
  let currentWipFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentWipFiber,
      alternate: currentWipFiber
    }
    
    nextWorkofUnit = wipRoot
  }
}

requestIdleCallback(workLoop)

export default {
  createElement,
  update,
  render
}