var math = require("mathjs");

var input = '3C';
var decimalValue = parseInt(input, 16); // Base 16 or hexadecimal
var character = String.fromCharCode(decimalValue);
console.log('Input:', input);
var rule = [{l: 'true' , r: 'true' }, {l: 'false', r: 'false'}];
console.log('Decimal value:', decimalValue);
console.log('Character representation:', character);
console.log(math.simplify(" a ==  2 + 2", {}, {}).toString());
// var node = math.simplify("a.length > 0");
// console.log(math.simplify("x+1+y", {x: 1}));
// function f(a, b, c) {
//   var s = a+b+c;
//   return s;
// }
//
// console.log(f(1, 2));;
// console.log("aaaa" == 0);
