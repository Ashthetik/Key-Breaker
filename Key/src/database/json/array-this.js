// Don't run this unless you are using your own password list

let array;
require('fs').readFile("./common-pass.txt", (e, content) => {
    if (e) return console.error(e);
    array = content.toString().split("\n");
    array = [...array];
    array = Array.from(array);
    array = Object.assign([], array);

    require('fs').writeFile(("./common-pass.txt"), array.toString(), (e) => {
        if (e) return console.error(e);
        console.log("Saved");
    });
    console.log(array);
});
//console.log(array);