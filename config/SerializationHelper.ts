import * as objectModule from "./exports"
export class SerializationHelper {
    static fillFromJSON(json: string, object: any): void {
        var jsonObj = JSON.parse(json);
        if (Array.isArray(jsonObj)) {
            let array = jsonObj;
            // object = [];
            for (var j = 0; j < array.length; j++) {
                if (array[j] == null) {
                    object[j] == null;
                } else if (Array.isArray(array[j])) {
                    object[j] = [];
                    SerializationHelper.fillFromJSON(array[j], object[j]);
                } else if (typeof array[j] == "object") {
                    let type = array[j]["type"];
                    if (type) {
                        object[j] = new (<any> objectModule)[type];
                        SerializationHelper.fillFromJSON(JSON.stringify(array[j]), object[j]);
                    } else {
                        object[j] = {}
                        SerializationHelper.fillFromJSON(JSON.stringify(array[j]), object[j]);
                    }
                }  else {
                    object[j] = array[j];
                }
            }
        } else if (typeof jsonObj == "object") {
            for (var propName in jsonObj) {
                if (Array.isArray(jsonObj[propName])) {
                    let array:[] = jsonObj[propName];
                    object[propName] = [];
                    SerializationHelper.fillFromJSON(JSON.stringify(array), object[propName]);
                    console.log(object[propName]);
                }
                else if (typeof jsonObj[propName] == 'object') {
                    let type = jsonObj[propName]["type"];
                    if (type) {
                        object[propName] = new (<any>objectModule)[type];
                        SerializationHelper.fillFromJSON(JSON.stringify(jsonObj[propName]), object[propName]);
                    } else {
                        object[propName] = {};
                        SerializationHelper.fillFromJSON(JSON.stringify(jsonObj[propName]), object[propName]);
                    }
                } else {
                    object[propName] = jsonObj[propName];
                }
            }
        } else {
            object = jsonObj;
        }
    }
}
