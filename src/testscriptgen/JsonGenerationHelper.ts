import {JSONObject} from "typescript-logging";
import {AbstractProperty} from "./AbstractProperty";
import {PropertyAccessChangedToken} from "../normalizer/PropertyAccessChangedToken";
import {TestscriptGeneration} from "./TestscriptGeneration";

export function addOneLevelPropertyAccessToJsonObject(jsonObject: JSONObject, property: AbstractProperty, changedTokens: Map<string, PropertyAccessChangedToken>): void {
    let words: string[] = property.getName().split(".");
    let subProperty = words[1];
    let type = changedTokens.get(property.getName()).getType();
    changedTokens.delete(property.getName());
    if (type === "boolean") {
        jsonObject.addBoolean(subProperty, Boolean(Number(property.getValue())));
    }
    else if (type === "string") {
        jsonObject.addString(subProperty, deleteQuotes(property.getValue()));
    }
    else jsonObject.addNumber(subProperty, Number(property.getValue()));
}

export function addTwoLevelPropertyAccessToJsonObject(jsonObject: JSONObject, property: AbstractProperty, changedTokens: Map<string, PropertyAccessChangedToken>): void {
    let type = changedTokens.get(property.getName()).getType();
    changedTokens.delete(property.getName());
    let words: string[] = property.getName().split(".");
    let subProperty = words[1];
    let subsubProperty = words[2];
    // jsonObject[subProperty][subsubProperty] = Number(property.getValue());
    let subObject = new JSONObject();

    if (type === "boolean") {
        subObject.addBoolean(subsubProperty, Boolean(Number(property.getValue())));
    } else if (type === "string") {
        subObject.addString(subsubProperty, deleteQuotes(property.getValue()));
    }
    else {
        subObject.addNumber(subsubProperty, Number(property.getValue()));
    }
    jsonObject.addObject(subProperty, subObject);
}

export function generateJsonValueForPropertyNotInConstraints(jsonObject: JSONObject, propertyAccessExpression: string, type: string) : any {
    if (getPropertyAccessLevel(propertyAccessExpression) === 1) {
        generateJsonValueForOneLevelPropertyNotInConstraints(jsonObject, propertyAccessExpression, type);
    }
    else if (getPropertyAccessLevel(propertyAccessExpression) === 2) {//xu ly level 2 sv.school.name, sv.school.localtion => school :{name: , localtion: }
        generateJsonValueForTwoLevelPropertyNotInConstraints(jsonObject, propertyAccessExpression, type);
    }
}

export function generateJsonValueForOneLevelPropertyNotInConstraints(jsonObject: JSONObject, propertyAccessExpression: string, type: string) : void {
    let words: string[] = propertyAccessExpression.split(".");
    let subProperty = words[1];
    if (type === "boolean") {
        jsonObject.addBoolean(subProperty, generateRandomValueCorrespondingWithType(type));
    } else if (type === "string") {
        jsonObject.addString(subProperty, generateRandomValueCorrespondingWithType(type));
    }
    else jsonObject.addNumber(subProperty, generateRandomValueCorrespondingWithType(type));
}

export function generateJsonValueForTwoLevelPropertyNotInConstraints(jsonObject: JSONObject, propertyAccessExpression: string, type: string) : void {
    let words: string[] = propertyAccessExpression.split(".");
    let subProperty = words[1];
    let subsubProperty = words[2];
    // jsonObject[subProperty][subsubProperty] = Number(property.getValue());
    let subObject = new JSONObject();
    if (type === "boolean") {
        subObject.addBoolean(subsubProperty, generateRandomValueCorrespondingWithType(type));
    } else if (type === "string") {
        subObject.addString(subsubProperty, generateRandomValueCorrespondingWithType(type));
    } else {
        subObject.addNumber(subsubProperty, generateRandomValueCorrespondingWithType(type));
    }
    jsonObject.addObject(subProperty, subObject);
}

export function generateRandomValueCorrespondingWithType(type: string): any {
    if (type === "boolean") return true;
    else if (type === "number") return generateRandomNumber();
    else if (type === "string") {
        //TODO generate value for string
        return "random_abc";
    }
}

export function getPropertyAccessLevel(name: string) : number {
    let words: string [] = name.split(new RegExp("\\.", "g"));
    return words.length - 1;
}

export function generateRandomNumber(min: number=0, max: number=10): number {
    return Math.floor(Math.random()*(max-min+1));
}

export function deleteQuotes(s: string): string {
    if (s.startsWith("\"") && s.endsWith("\"")) {
        return s.substring(1, s.length -1);
    }
    return s;
}
