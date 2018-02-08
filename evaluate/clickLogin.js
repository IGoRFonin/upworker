module.exports = () => {
    const buttons = document.querySelectorAll('#main-auth-card [type="submit"]');
    [].slice.call(buttons).reduce((acc, button) => {
        if (button.offsetParent !== null) {
            button.click();
        }
    });
    return Promise.resolve();
}