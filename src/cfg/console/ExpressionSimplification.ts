import * as math from "mathjs";
import {MathNode, simplify , parse} from "mathjs";



console.log("a".length);

let a,b,c = 1;
let x=1, y=2, z=3;
console.log(a + " " + b + " " + c);
console.log(x + " " + y + " " + z);
// const p = math.parse("1+1");
// console.log(math.evaluate("x + 1"));
// math.parse("x=1;y=2");
// console.log(math.simplify("x + 1 + 1+y+ 3*z", ).toString());
/// TS_IGNORE
const newExp = math.simplify("(1+1)");
const node = math.simplify("a > b and c> 1");
const node2: MathNode= math.simplify("a + 1 | b - 2 - 2");
console.log(node2.type);
// const operator = node2.
console.log(node.toString());
console.log(node2.toString());
// console.log(math.simplify(newExp).toString());
// console.log(math.simplify("3x + x +(x+1)", ['x -> 2*x']).toString());
// console.log(math.simplify("x + 1 + 1+y+ 3*z" ).evaluate({x:1, y:1,z:1}));
// console.log(math.simplify("a[1+1+1]=1"));
// function f(a: number, b?: string, c?: number) {
//     const s = a+b+c;
//     return s;
// }
//
// console.log(f(1, 2));;
function f(node: MathNode) {
    console.log(node.toString());

}