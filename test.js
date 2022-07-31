
var stack_count = 0;
function log_test_1() {
    console.log(stack_count);
    stack_count += 1;
    log_test();
}

function log_test_2_part1() {
    return new Promise((resolve, reject) => {
        stack_count += 1;
        console.log(stack_count)
        resolve();
    });
}
  
function log_test_2() {
    log_test_2_part1().then(result => {
        log_test_2()
    });
}

log_test_2();
