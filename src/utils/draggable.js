export class Draggable {
  constructor(element, handle) {
    this.element = element;
    this.handle = handle || element;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startLeft = 0;
    this.startTop = 0;

    this.bindEvents();
  }

  bindEvents() {
    this.handle.style.cursor = 'move';
    this.handle.addEventListener('mousedown', this.startDragging.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDragging.bind(this));
  }

  startDragging(e) {
    if (e.button !== 0) return; // Only react to left mouse button
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startLeft = parseInt(window.getComputedStyle(this.element).left, 10);
    this.startTop = parseInt(window.getComputedStyle(this.element).top, 10);
    e.preventDefault();
  }

  drag(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    this.element.style.left = `${this.startLeft + dx}px`;
    this.element.style.top = `${this.startTop + dy}px`;
  }

  stopDragging() {
    this.isDragging = false;
  }
}
