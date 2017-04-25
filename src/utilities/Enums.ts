import { IEnums } from './IEnums';

class Enums implements IEnums {

    constructor() {
        "ngInject";
    }

    public enumToArray(obj: any): any[] {
        let result: any[] = [];
        let key;

        for (key in obj)
            if (obj.hasOwnProperty(key))
                result.push(obj[key]);

        return result;
    };

}


angular
    .module('pipEnums', [])
        .service('pipEnums', Enums);

