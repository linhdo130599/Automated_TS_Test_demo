import {run} from "jest-cli";
export async function executeTestScript(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const name = "C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test";
        await run([], name ).catch(err => {
            reject(err);
        });
        resolve(true);
    })
}

// executeTestScript()

//check % coverage

