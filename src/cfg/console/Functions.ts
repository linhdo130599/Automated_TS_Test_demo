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

export function declare_new_variable_test(a: number, b: number): boolean {
    let q=1,e=2+2+q,s="a",ac="abc" + s;
    let result,sum = a + b;
    let asc=s+q;
    if (a>e) {
        if (sum > 0) return true;
        else return false;
    } else return false;
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

//Multiple assignment
export function update_variable_test2(a: number, b: number, c: number): boolean {
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

export function foo(a: number, b: number): number {
    let x = a + b; let y = a - b;
    if ( x > y) {
        return a;
    } else {
        x = x + 1;
        if (x < 10) return b;
    }
}
