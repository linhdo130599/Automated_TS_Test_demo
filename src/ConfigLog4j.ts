import {LoggerFactory, LoggerFactoryOptions, LFService, LogGroupRule, LogLevel} from "typescript-logging";
const options = new LoggerFactoryOptions()
    // .addLogGroupRule(new LogGroupRule(new RegExp("model.+"), LogLevel.Debug))
    .addLogGroupRule(new LogGroupRule(new RegExp(".*"), LogLevel.Debug));

// Create a named loggerfactory and pass in the options and export the factory.
// Named is since version 0.2.+ (it's recommended for future usage)
export const factory = LFService.createNamedLoggerFactory("LoggerFactory", options);
// import * as dotenv from "dotenv";
// // dotenv.config({path: __dirname + '/config.env'});
// dotenv.config({path: __dirname + '/config-example.env'});

