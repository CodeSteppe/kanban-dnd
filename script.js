const droppables = document.querySelectorAll('.droppable');
const draggables = document.querySelectorAll('.draggable');
const transitionTime = 500;
let dragging;
let cloned;

document.body.style.setProperty('--transitionTime', transitionTime + 'ms');

function cleanClass(className) {
  const elements = document.querySelectorAll(`.${className}`);
  for (const el of elements) {
    el.classList.remove(className);
  }
}

// drag start
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('draggable')) {
    dragging = e.target;
    dragging.classList.add('dragging');
    cloned = dragging.cloneNode(true);
  }
});

function handleDragEnd() {
  if (!dragging) return;
  dragging.classList.add('will-remove');
  setTimeout(() => {
    dragging.remove();
    cleanClass('dragging');
  }, [transitionTime]);
}

// drag end
document.addEventListener('dragend', e => {
  cleanClass('dragging');
  cleanClass('new-added');
});

// drag over
droppables.forEach(droppable => {
  droppable.addEventListener('dragover', e => {
    e.preventDefault();
    const frontSib = getClosestFrontSibling(droppable, e.clientY);
    const realFrontSib = dragging.previousElementSibling;
    if (frontSib === realFrontSib) return;
    if (frontSib) {
      if (frontSib.nextElementSibling === cloned || frontSib === cloned) {
        return;
      }
      cloned.classList.add('new-added');
      frontSib.insertAdjacentElement('afterend', cloned);
      handleDragEnd(dragging);
    } else {
      if (droppable.firstChild === cloned) {
        return;
      }
      // 前面没有元素了，放第一的位置
      cloned.classList.add('new-added');
      droppable.prepend(cloned);
      handleDragEnd(dragging);
    }
  });
});

// 获取被移动元素前面最近的相邻元素
function getClosestFrontSibling(droppable, draggingY) {
  const siblings = droppable.querySelectorAll('.draggable:not(.dragging)');
  let result;

  for (const sibling of siblings) {
    const box = sibling.getBoundingClientRect();
    // 获取 sibling 的 中心 Y
    const boxCenterY = box.y + box.height / 2;
    if (draggingY >= boxCenterY) {
      result = sibling;
    } else {
      // draggingY < boxCenterY 说明：要么已经找到前方最近的相邻元素，要么被拖动到第一的位置
      return result;
    }
  }

  return result;
}