const shuffle = (arr) => {
    const shuffled = [...arr];
    for (let i = 0; i < shuffled.length - 1; i++) {
        const ix = 1 + i + Math.trunc(Math.random() * (shuffled.length - i - 1));
        const tmp = shuffled[ix];
        shuffled[ix] = shuffled[i];
        shuffled[i] = tmp;
    }
    return shuffled
}

export default shuffle