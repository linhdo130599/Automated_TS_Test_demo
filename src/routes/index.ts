import * as express from "express";
import {execute} from "../demo/multipleDemo";
import * as fs from "fs";
import * as multer from "multer";
import * as unzip from "unzip-stream";
import {initRootNode, getFiles, unzipUploadFile, generateCoverageReport} from "../server/Utils";
import * as path from "path";
// import {copySync} from "fs-extra";
import {copySync} from "../server/Utils";
import {Project} from "ts-morph";
import {generateTestdataForFunctions} from "../server/Utils"


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, 'D:\\tsgen')
        cb(null, process.env.ZIP_FOLDER)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
    }
});

var upload = multer({ storage: storage }).single('file');
export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
export const register = ( app: express.Application ) => {
    const oidc = app.locals.oidc;

    // define a route handler for the default home page
    app.get( "/", ( req: any, res ) => {
        // const user = req.userContext ? req.userContext.userinfo : null;
        // res.render( "index", { isAuthenticated: req.isAuthenticated(), user } );

        res.render( "index" );
    } );

    app.post( "/generate", ( req: any, res ) => {
        const functions = req.body.functions;
        const tsConfigPath= req.body.tsConfigPath;
        const srcPath = req.body.srcPath;
        const rootPath = req.body.rootPath;
        console.log(tsConfigPath);
        console.log(srcPath);
        generateTestdataForFunctions(functions, tsConfigPath, srcPath);
        let rootNode = initRootNode(rootPath);
        let files = {};
        files[rootNode["path"]] = rootNode;
        let project = new Project({
            tsConfigFilePath: tsConfigPath
        });
        files = getFiles(rootPath, files, rootNode, project);
        res.status(200).send({files: files});
    });

    app.post( "/import", ( req: any, res ) => {
        // let srcDir = req.files.srcDir;
        // console.log(req.body.srcDir);
        // console.log(req.files.file);
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            let fileName = req.file.originalname;
            let srcDir = req.body.srcDir;
            // console.log(req.body.srcDir);
            let fileNameWithoutExtension= fileName.substring(0, fileName.length-4);
            console.log("Start unzip....." + fileName);
            console.log("New File Name: ", req.file.filename);
            let newFileName = req.file.filename;
            let newNameWithoutExtension= newFileName.substring(0, newFileName.length-4);
            // let rootUnzipPath = `D:/tsgen/${newNameWithoutExtension}`;
            let rootUnzipPath = `${process.env.ZIP_FOLDER}/${newNameWithoutExtension}`;
            if (fileName.endsWith(".zip")) {
                // unzipUploadFile(req.file.path, rootUnzipPath);
                fs.createReadStream(req.file.path).pipe(unzip.Extract({ path: rootUnzipPath })).on('close', () => {
                    console.log("End unzip.....");
                    console.log(rootUnzipPath);
                    // copySync(path.normalize(rootUnzipPath), path.normalize(process.env.WORKING_FOLDER));
                    let rootNodePath = rootUnzipPath + "/" + fileNameWithoutExtension;
                    let rootNode = initRootNode(rootNodePath);
                    let files = {};
                    files[rootNode["path"]] = rootNode;
                    let tsConfigFilePath = rootNodePath+"/tsconfig.json";
                    let project = new Project({
                        tsConfigFilePath: tsConfigFilePath
                    });
                    files = getFiles(rootNodePath, files, rootNode, project);
                    // let srcPath = rootNodePath+"/calculator/ts/src";
                    let srcPath = rootNodePath+ srcDir;
                    let testPath = rootNodePath+"/ts/tests";
                    return res.status(200).send({files: files, tsConfigPath: tsConfigFilePath, srcPath: srcPath, rootPath: rootNodePath});
                })
            }
        })
    } );

    app.post( "/content", ( req: any, res ) => {
        const path = req.body.path;
        console.log(path);

        const content = fs.readFileSync(path).toString();

        res.status(200).send({content: content});

    } );

    app.post( "/testcases", ( req: any, res ) => {
        const functionPath = req.body.path;
        console.log(functionPath);

        const testcasesPath = functionPath.replace("/src/", "/testdata_dtht/")
                                            .replace(".ts/", ".")+ ".txt" ;
        if (fs.existsSync(testcasesPath)) {
            const testdata = fs.readFileSync(testcasesPath).toString();
            res.status(200).send({testcases: JSON.parse(testdata)});
        } else {
            res.status(200).send({testcases: {}});
        }

    } );

    app.post( "/report", ( req: any, res ) => {
        const rootPath = req.body.rootPath;

        let reportPath = generateCoverageReport(rootPath);
        if (reportPath) {
            res.status(200).send({reportPath: reportPath});
        }
        else {
            res.status(500).send({message: "Run test and get coverage report failed"});
        }
    } );

    app.get( "/test", (req, res) => {
        res.send("Hello World");
    } );



    // define a secure route handler for the login page that redirects to /guitars
    // app.get( "/login", oidc.ensureAuthenticated(), ( req, res ) => {
    //     res.redirect( "/guitars" );
    // } );

    // define a route to handle logout
    // app.get( "/logout", ( req: any, res ) => {
    //     req.logout();
    //     res.redirect( "/" );
    // } );
};
