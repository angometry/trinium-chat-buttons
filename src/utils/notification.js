export class TriniumNotification {
  constructor(options = {}) {
    this.content = options.content || '';
    this.type = options.type || 'info'; // 'info', 'success', 'warning', 'error'
    this.duration = options.duration || 3000; // animation duration in milliseconds
  }

  show() {
    const notificationHtml = `
      <div class="tcb-notification tcb-notification-${this.type}">
        <p>${this.content}</p>
      </div>
    `;

    $('body').append(notificationHtml);
    const $notification = $('.tcb-notification').last();

    $notification
      .fadeIn(300)
      .delay(this.duration)
      .fadeOut(300, function () {
        $(this).remove();
      });
  }
}
