const TOAST_TYPE = {
    'error': { color: 'red', icon: '<i class="fas fa-times-circle toast-i"></i>' },
    'warn': { color: 'orange', icon: '<i class="fas fa-exclamation-triangle toast-i"></i>' },
    'info': { color: 'blue', icon: '<i class="fas fa-info-circle toast-i"></i>' },
};
const TOAST_DISAPPEAR_WAIT = 4000;
function closeToast(toast) {
    toast.attr('class', 'toast-disappear');
    toast.register('animationend', () => toast.kill());
}
function toast(type, value) {
    let color = TOAST_TYPE[type].color || TOAST_TYPE.info.color;
    let toastCloseButton = new DynamicElement('div')
        .attr('class', 'toast-closeBtn')
        .register('click', () => closeToast(_toast))
        .injectHtml(`<i class="fas fa-times"></i>`).entity;
    let toastText = new DynamicElement('div')
        .attr('class', 'toastText')
        .injectHtml(`${TOAST_TYPE[type] ? TOAST_TYPE[type].icon : ''}${value}`).entity;
    let _toast = new DynamicElement('div')
        .attr('class', 'toast')
        .attr('style', `background:${color}`)
        .insert(toastText)
        .insert(toastCloseButton);
    DOM.get('#toastlist').appendChild(_toast.entity);
    setTimeout(() => closeToast(_toast), TOAST_DISAPPEAR_WAIT);
}