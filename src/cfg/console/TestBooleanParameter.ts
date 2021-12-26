import {booleanFunction} from "./Functions";

const x = booleanFunction.apply(null,[0,1]);
let z = undefined;
let y = null;
// z = true;
console.log(z);
if (!z) console.log("true");
else console.log("false");


console.log(x);
const a: boolean = true;
// @ts-ignore
console.log(a === true);

