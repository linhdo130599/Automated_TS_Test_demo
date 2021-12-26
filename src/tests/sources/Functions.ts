import {jsonArrayMember, jsonMapMember, jsonMember} from "typedjson";


export class School {
    public numberRoom: number;
    public area: number;
    public name: string;
    constructor(numberRoom?: number, area?: number, name?: string) {
        this.numberRoom = numberRoom;
        this.area = area;
        this.name = name;
    }

    getName() {
        return this.name;
    }
}


export class Person {

    public height: number;
    public age: number;
    public school: School;
    public schools: boolean;
    public isGirl: boolean;
    public name: string;
    public length: number;
    public phone: string[];
    private fullName: string;
    constructor(height?: number) {
        this.height = height;
    }

    getName(): string {
        return this.name;
    }

    getAge(): number {
        return this.age;
    }

    getSchool(): School {
        return this.school;
    }
}

export class Algorithm {
    static max(a: number, b: number) : number {
        if (a > b) return  a;
        else return b;
    }
}

export function complex_function(a: number, b: number): number {
    if (a>b) {
        let a = 1;
        return a;
    }
    else if (b == 2){
        let b = 2;
        return b;
    } else if (((a==5))) {
        return 0;
    } else if ((!(b))) {
        return 1;
    } else if ((a ==3) && (b<4)){
        return 10;
    } else if (false) {
        return 1;
    } else if ('a'){
        return 1;
    }
}

export function max(a: number, b: number): number {
    if (a>b) return a;
    else return b;
}

export function booleanFunction(a: boolean, b: boolean): number {
    if (a == true) {
        return 1;
    } else return 2;
}

export function declare_new_variable_test(a: number, b: number, c: string): boolean {
    let q=1,e=2+2+q,s="a",ac="abc" + s;
    let result,sum = a + b;
    let asc=s+q;
    if (c.startsWith("bbb") && c.length > a) {
        if (c.endsWith("aaa") == true) return true;
        else return false;
    } else return false;
    // if (a>e) {
    //     if (sum > 0) return true;
    //     else return false;
    // } else return false;
}

export function update_variable_test1(a: number, b: number, c: number): boolean {
    a=a+1;
    b=b+1;
    // b=1;
    // c=1+c;
    // a=c;
    let sum = a + b;
    if (a>b && c > 1)  {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

export function update_variable_test2(a: number, b: number, c: number): boolean {
    a=a+1;
    b=b+1;
    // b=1;
    // c=1+c;
    // a=c;
    let sum = a + b;
    if (a>b && c > 1)  {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

//Multiple assignment
export function update_variable_test4(a: number, b: number, c: number): boolean {
    a=a+1;
    b=b+1;
   // c=1;
    b=c=c+1+1;
    // a=b=c=1+1 => a=b=c=2
    let sum = a + b;
    if (a>b) {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

//Multiple assignment
export function multiple_assignment(a: number, b: number, s: Array<number>, person: Person): boolean {
    a=a+1;
    b=b+1;
    // c=1;
    b=s[0]=s[1]=person.age = person.phone.length;
    // b=person.phone.length;
    // a=b=c=1+1 => a=b=c=2
    let sum = s[0] + s[1];
    if (a>b) {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

//Multiple assignment
export function update_variable_test5(a: number, b: number, c: number): boolean {
    a=a+1;
    b=b+1;
    // c=1;
    b=1, c = a+1;
    // a=b=c=1+1 => a=b=c=2
    let sum = a + b;
    if (a>b) {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

export function update_variable_test3(a: number, b: number): boolean {
    let sum = a + b;
    sum = 4;
    if (a>b) {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

export function primary_condition_expression_test(a: number, b: number): number {
    a=a+1;
    b=b+1;
    a=0;
    if (a > b+1) {
        if (a> b) return a;
        else return b;
    }
    else return 0;
}
export function conditonal_expression_assignment(a: number, b: number) {
    a=a+1+b;
    b=b+1;
    let i = 1;
    i++;
    i=3;
    let sum = a + b;
    a= b ==1 ? 1 : 0;
    let y : boolean;
    y= a > b;
    a=b=a+1+1+b;
    let x = new String("a");
    if (a>b) {
        if (sum > 0) return true;
        else return false;
    } else return false;
}

export function add(a: number, b: number): number {
    let sum = a + b;
    if (square(1)) return ;
    return sum;
}

export function square(a: number): number {
    let result = a * a;
    let tmp = result++;
    return tmp;
}

export function simple_test(a: number, b: number) {
    if (a<1) {
        return a;
    } else if (a>5) {
        if (b>a) return b;
    }
}

export function negative_single_condition_test(a: number, b: number) {
    if (a<1) {
        return a;
    } else if (a>5) {
        if (b>a) return b;
        else if (a>3) return 4;
    }
}

export function negative_multiple_condition_test(a: number, b: number) {
    if (a<1 && b==2) {
        return a;
    } else if (a>5) {
        if (b>a) return b;
        else if (a>3) return 4;
    }
}

export function caculate(person3: Person, person: Person): number {
    let result = person.age + person.height;
    let person2 = new Person();
    if (person.age == 18) {
        if (person.height > 10) {
            return 1;
        }
        else return 2;
    }
    return result;
}

export function caculate3( person: Person, s: Array<string>): number {
    let result = person.age + person.height;
    let person2 = new Person();
    s[1] = person.school.name;
    if (person.name.length > 10 && person.name.startsWith("hoaithu") && result > 100) {
        if (person.phone[1].startsWith("123456") == true && s[1].startsWith("schoolUET") && person.phone[1].endsWith("end")) {
            return 1;
        }
        else return 2;
    }
    return result;
}

export function assign_to_json_object_test( person, s: string): number {
    person = {name: "HoaiThu", age: 18, school: {name: "uet", rooms: 200}};
    let age = person.age;
    let room = person.school.rooms;
    let sum = age + s.length + room;
    if (sum < 300) {
        if (s.startsWith("UETTT")) {
            return 1;
        }
        else return 2;
    }
    return 1;
}

export function call_getter_test( person: Person, s: string): number {
    let person2 = {name: "hoaithu", age: 23, school: {name: "UET"}};
    if (person.getSchool().getName().length > 5 && s.length > 10) {
        if (person.getAge() > 18 && person2.school.name.length < 20) {
            return 1;
        }
        else return 2;
    }
    return 1;
}

export function sum(a: number, b: number) {
    return a + b;
}

export function external_method_test( a: number, b: number, person: Person): number {
   let c: number = sum(a,b);
   let d: number = Algorithm.max(a,b);
   const temp: Person = new Person();
   let e: string = person.getName();
   if (c > 3 && d === 10 && e ==="hoaithu") {
       return 1;
   } else {
       return  0;
   }
}

export function switch_statement_test(a: number, b: number, s: string): number {
    // let s: string = "dfdfsd";
    switch (s.length) {
        case 1:
            let c = 1;
            break;
        case 2: {
            {
                a = a + 1;
            }
            break;

        }
        default: {
            break;
        }

    }
    if (b > 10 && a < 5 ) {
        return 1;
    }
    return 1;
}

export function switch_statement_test_2(a: number, b: number, s: string): number {
    // let s: string = "dfdfsd";
    switch (-a) {
        case 0:
        case -1:
        case 1:
            let c = 1;
            break;
        case 5: {
            a = 10;
        }
        case 6:
        case 2: {
            a = a + 1;
            break;

        }
        case 7:
        case 8:
        default: {
            break;
        }

    }
    if (b > 10 && a < 5 ) {
        return 1;
    }
    return 1;
}


export function test_method_string_indexof1(s:string){
    let a=s.indexOf("abc");
    if(a===3){
        return 0;
    }
    else if (a===5){
        return 1;
    }
}

export function test_method_string_indexof2(s1:string, s2: string){
    let a= s1.substring(0,5);
    let x=  s2.indexOf(a);
    let b: number = s2.indexOf("abc", 10);
    if(a==="abcde" && x===3){
        if (b===11){return 0;}
        else return 1;
    }
}

export function test_method_string_substringh2(s:string){
    let a=s.substring(0,5);
    if( a==="abcde"){
        return 1;
    }
}
