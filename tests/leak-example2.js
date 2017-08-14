if (!global.arr) global.arr = [];
function calculate() {
    for (let i = 0; i <= 100; i++) {
        arr.push({
            number_: Math.random() + '-',
            date_: Date.now() + '-'
        });
    }
    for (let i = 0; i < 100; i++) {
        arr.pop();
    }
}

for (let i = 0; i < 1000; i++) {
    calculate();
}