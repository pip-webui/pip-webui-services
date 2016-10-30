'use strict';

export interface ITags {
    normalizeOne(tag: string): string;
    compressOne(tag: string): string;
    equal(tag1: string, tag2: string): boolean;
    normalizeAll(tags: any): string[];
    compressAll(tags: any): string[];
    extract(entity: any, searchFields?: string[]): string[];
}


class Tags implements ITags {

    public normalizeOne(tag: string): string {
        return tag 
            ? _.trim(tag.replace(/(_|#)+/g, ' '))
            : null;
    }

    public compressOne(tag: string): string {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLowerCase()
            : null;
    }

    public equal(tag1: string, tag2: string): boolean {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return this.compressOne(tag1) == this.compressOne(tag2);
    }

    public normalizeAll(tags: any): string[] {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);

        tags = _.map(tags, (tag: string) => this.normalizeOne(tag));

        return tags;
    }

    public compressAll(tags: any): string[] {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);

        tags = _.map(tags, (tag: string) => this.compressOne(tag));

        return tags;
    }

    public extract(entity: any, searchFields?: string[]): string[] {
        let tags = this.normalizeAll(entity.tags);

        _.each(searchFields, (field) => {
            let text = entity[field] || '';

            if (text != '') {
                let hashTags = text.match(/#\w+/g);
                tags = tags.concat(this.normalizeAll(hashTags));
            }
        });

        return _.uniq(tags);
    }
}


angular
    .module('pipTags', [])
    .service('pipTags', Tags);
