/*
 * ===============Dialog 엘리먼트의 구조===============
 * div.dialog
 *  div.dialog-head
 *      <text>
 *      div.dialog-close
 *  div.dialog-body
 *      ...
 *  div.dialog-tail
 *      button.dialog-button
 *      ...
 * ===================================================
 */
function closeDialog(dialog) {
    dialog.classList.add('disappear');
    dialog.addEventListener('animationend', () => {
        dialog.style.display = 'none';
        dialog.classList.remove('disappear');
        dialog.style.opacity = '1';
    });
}
/**
 * 다이얼로그를 보이거나 숨긴다.
 * @param {HTMLElement} dialog 보이거나 숨길 다이얼로그
 * @returns {HTMLElement}
 */
function showDialog(id) {
    let dialog = DOM.get(id);
    console.log(dialog.style.display);
    if (dialog.style.display == 'none') {
        dialog.style.display = 'block';
        dialog.style.left = (window.innerWidth - dialog.offsetWidth) * 0.5 + 'px';
        dialog.style.top = (window.innerHeight - dialog.offsetHeight) * 0.5 + 'px';
    }
    else
        closeDialog(dialog);
    return dialog;
}
DOM.get('.dialog-closeBtn').addEventListener('click', e => {
    closeDialog(e.currentTarget.parentNode.parentNode);
});
showDialog('#itemDialog');
