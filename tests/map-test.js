global.map2 = new Map();
for (let i = 0; i < 100000; i++) {
    // map2[i] = 'val';
    map2.set(i, 'val');
}

setTimeout(() => {
    console.log(map2.get((Math.random() * 1000) | 0));
}, 10000);
