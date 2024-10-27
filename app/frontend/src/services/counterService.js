// src/services/counterService.js

let count = 0;

export const incrementCount = () => {
    count += 1;
    return count;
};

export const decrementCount = () => {
    count -= 1;
    return count;
};

export const getCount = () => {
    return count;
};
