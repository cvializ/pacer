export const setBackgroundColor = (color) => {
    const root = document.documentElement;
    root.style.setProperty('--background-status-color', color);
}
