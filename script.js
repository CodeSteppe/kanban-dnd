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
  }
});

// drag over
droppables.forEach(droppable => {
  droppable.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const frontSib = getClosestFrontSibling(droppable, e.clientY);
    if (frontSib) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
      frontSib.insertAdjacentElement('afterend', dragging);
    } else {
      // 前面没有元素了，所以放第一个
      droppable.prepend(dragging);
    }
  });
});

// 获取被移动元素前面的最近的元素
function getClosestFrontSibling(droppable, draggingY) {
  const siblings = [...droppable.querySelectorAll('.draggable:not(.dragging)')];
  let result;
  for (const sibling of siblings) {
    const box = sibling.getBoundingClientRect();
    // 获取sibling的中心y
    const boxCenterY = box.y + box.height / 2;
    if (draggingY >= boxCenterY) {
      result = sibling;
    } else {
      // draggingY < boxCenterY 说明：要么已经找到最近的前方元素，要么被拖动到第一的位置
      return result;
    }
  }
  return result
}