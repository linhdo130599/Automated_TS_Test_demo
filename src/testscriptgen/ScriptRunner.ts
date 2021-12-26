import {execSync, spawnSync} from "child_process";
import {Logger} from "typescript-logging";
import {factory} from "../ConfigLog4j";
import * as fs from "fs";
import * as fsextra from "fs-extra";
import * as Path from "path";
import * as path from "path";

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

export class ScriptRunner {
    public static logger: Logger = factory.getLogger("ScriptRunner");
    public static readonly CD_INPUT_PROJECT_DIR: string = "cd C:\\Users\\Admin\\IdeaProjects\\test-project\\example-typescript-nyc-mocha-coverage";
    // public static readonly CD_INPUT_PROJECT_DIR: string = "D: && cd D:\\tsgen\\1590254211826-simple-test\\simple-test";

    public static readonly EXECUTE_TEST_COMMAND = "npm run coverage" ;
    // public static readonly EXECUTE_TEST_COMMAND = "npm --version" ;

    execute() {
        let command = this.generateExecuteTestCommand();
        // let coverageDir = "C:\\Users\\Admin\\IdeaProjects\\typescript-AST\\input\\example-typescript-nyc-mocha-coverage\\coverage";
        // deleteFolderRecursive(coverageDir);
        try {
            let runner = execSync(command,{timeout: 50000});
            let stdout = runner.toString();
            ScriptRunner.logger.info(stdout);
        } catch (e) {
            ScriptRunner.logger.error(e.getMessages());
        }

    }

    generateExecuteTestCommand(): string {
        let command: string = "";
        if (process.platform === "win32") {
            command = ScriptRunner.CD_INPUT_PROJECT_DIR + " && " + ScriptRunner.EXECUTE_TEST_COMMAND;
        } else if (process.platform === "linux") {
            command = ScriptRunner.CD_INPUT_PROJECT_DIR + " ; " + ScriptRunner.EXECUTE_TEST_COMMAND;
        } else {
            throw new Error("Dont support this OS: " + process.platform);
        }
        return command;
    }


    getCoverageReport(rootPath: string): string {
        // ScriptRunner.copyMochaConfigFolder(process.env.MOCHA_CONFIG_DIR, rootPath);
        let command = this.generateExecuteCommand(rootPath);
        console.log(command);
        // let coverageDir = "C:\\Users\\Admin\\IdeaProjects\\typescript-AST\\input\\example-typescript-nyc-mocha-coverage\\coverage";
        // deleteFolderRecursive(coverageDir);
        try {
            let runner = execSync(command,{timeout: 50000});
            let stdout = runner.toString();
            ScriptRunner.logger.info(stdout);
            let reportPathInProject = path.normalize(rootPath + "/coverage");
            let reportPathInServer = path.normalize(process.env.NGINX_ROOT_HTML_FOLDER + "/coverage");
            fsextra.copySync(reportPathInProject, reportPathInServer,{overwrite: true});
            return `${process.env.NGINX_DOMAIN}/coverage/lcov-report/index.html`;
        } catch (e) {
            return null;
        }

    }

    generateExecuteCommand(rootPath: string): string {
        let command: string = "";
        if (process.platform === "win32") {
            command = process.env.WINDOW_DISK_PARTITION_NAME + " && cd " + path.normalize(rootPath) + " && " + ScriptRunner.EXECUTE_TEST_COMMAND;
        } else if (process.platform === "linux") {
            command = "cd " + path.normalize(rootPath) + " ; " + ScriptRunner.EXECUTE_TEST_COMMAND;
        } else {
            throw new Error("Dont support this OS: " + process.platform);
        }
        return command;
    }

    static copyMochaConfigFolder(from: string, to: string) {
        try {
            fsextra.copySync(from, to);
            ScriptRunner.logger.info("Copy Mocha folder config success");
        } catch (e) {
            ScriptRunner.logger.error(e.getMessages());
        }

    }

}
