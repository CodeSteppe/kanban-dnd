const droppables = document.querySelectorAll('.droppable');
const draggables = document.querySelectorAll('.draggable');

// drag start
document.addEventListener('dragstart', e => {
  if (e.target.classList.contains('draggable')) {
    e.target.classList.add('dragging');
  }
});

// drag end
document.addEventListener('dragend', e => {
  if (e.target.classList.contains('draggable')) {
    e.target.classList.remove('dragging');
    e.target.classList.remove('new-added');
  }
});

// drag over
droppables.forEach(droppable => {
  droppable.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    // droppable.append(dragging);
    const frontSib = getClosestFrontSibling(droppable, e.clientY);
    if (frontSib) {
      if (frontSib.nextElementSibling === dragging) {
        return;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
      dragging.classList.add('new-added');
      frontSib.insertAdjacentElement('afterend', dragging);
    } else {
      if (droppable.firstChild === dragging) {
        return;
      }
      // 前面没有元素了，放第一的位置
      droppable.prepend(dragging);
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