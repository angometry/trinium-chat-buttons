export class TriniumConfirmationDialog {
  constructor(options = {}) {
    this.content = options.content || game.i18n.localize('TCB_GMSCREEN.AreYouSure');
    this.yes = options.yes || game.i18n.localize('TCB_GMSCREEN.Yes');
    this.no = options.no || game.i18n.localize('TCB_GMSCREEN.No');
    this.callback = options.callback || (() => {});
  }

  async render() {
    const confirmationHtml = `
      <div class="tcb-editor-confirmation-dialog">
        <p>${this.content}</p>
        <div class="button-container">
          <button class="confirm-yes">${this.yes}</button>
          <button class="confirm-no">${this.no}</button>
        </div>
      </div>
    `;

    $('#tcb-gm-screen-editor').prepend(confirmationHtml);
    const $dialog = $('.tcb-editor-confirmation-dialog');

    $dialog.show();

    return new Promise((resolve) => {
      const confirmYesHandler = () => {
        cleanup();
        this.callback(true);
        resolve(true);
      };
      const confirmNoHandler = () => {
        cleanup();
        this.callback(false);
        resolve(false);
      };

      const cleanup = () => {
        $dialog.find('.confirm-yes').off('click', confirmYesHandler);
        $dialog.find('.confirm-no').off('click', confirmNoHandler);
        $dialog.remove();
      };

      $dialog.find('.confirm-yes').on('click', confirmYesHandler);
      $dialog.find('.confirm-no').on('click', confirmNoHandler);
    });
  }
}