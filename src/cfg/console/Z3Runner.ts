import {exec, execSync, spawnSync} from "child_process";
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere

export function test() {
    let command: string = "C:\\Users\\Admin\\IdeaProjects\\ava-master\\ava-master\\local\\z3\\bin\\z3.exe -smt2 C:\\Users\\Admin\\PycharmProjects\\untitled\\src\\constraints.smt2";
    // const stdout = exec(command);
    const stdout = spawnSync(command);
    console.log(stdout.stdout.toString());
    // stdout.stdout.on("data", data=> console.log(data.toString()));
}

test();
// stdout.stderr.on("error", data => console.log("Error" + data));
// console.log(stdout.toString());
// import { spawnSync} from "child_process";
// const child = spawnSync(command );
// console.error('error', child.error);
// console.log('stdout ', child.stdout);
// console.error('stderr ', child.stderr);