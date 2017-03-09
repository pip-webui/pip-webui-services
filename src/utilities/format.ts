import { IFormat } from './IFormat';

class Format implements IFormat {
    // Cached for parsed formats
    private cache = {};

    // Creates a sample line from a text
    public sample(value: string, maxLength: number): string {
        if (!value || value == '') {
            return '';
        }

        var length: number = value.indexOf('\n');
        length = length >= 0 ? length : value.length;
        length = length < maxLength ? value.length : maxLength;

        return value.substring(0, length);
    }

    private strRepeat(str: string, qty: number): string {
        if (qty < 1) { 
            return '';
        }
        var result: string = '';
        while (qty > 0) {
            if (qty & 1) result += str;
            qty >>= 1, str += str;
        }
        return result;
    }

    private getType(variable): string {
        return toString.call(variable).slice(8, -1).toLowerCase();
    }

    private parseFormat(fmt: string): any {
        let _fmt: string = fmt, match = [], parse_tree = [], arg_names: number = 0;
        while (_fmt) {
            if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                parse_tree.push(match[0]);
            }
            else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                parse_tree.push('%');
            }
            else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    let field_list: string[] = [], replacement_field: string = match[2], field_match: string[] = [];
                    if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1]);
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                            }
                            else {
                                throw new Error('Unknown error');
                            }
                        }
                    }
                    else {
                        throw new Error('Unknown error');
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('Mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            }
            else {
                throw new Error('Unknown error');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    }

    private format(parse_tree: any, argv: any): string {
        let cursor: number = 0; 
        let tree_length: number = parse_tree.length; 
        let output = [];

        for (let i = 0; i < tree_length; i++) {
            let node_type = this.getType(parse_tree[i]);
            if (node_type === 'string') {
                output.push(parse_tree[i]);
            }
            else if (node_type === 'array') {
                let match = parse_tree[i]; // convenience purposes only
                let arg: any;
                if (match[2]) { // keyword argument
                    arg = argv[cursor];
                    for (let k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(this.sprintf('Property "%s" does not exist', match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                } else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]];
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++];
                }

                if (/[^s]/.test(match[8]) && (this.getType(arg) != 'number')) {
                    throw new Error(this.sprintf('Expecting number but found %s', this.getType(arg)));
                }
                switch (match[8]) {
                    case 'b': arg = arg.toString(2); break;
                    case 'c': arg = String.fromCharCode(arg); break;
                    case 'd': arg = parseInt(arg, 10); break;
                    case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                    case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                    case 'o': arg = arg.toString(8); break;
                    case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                    case 'u': arg = Math.abs(arg); break;
                    case 'x': arg = arg.toString(16); break;
                    case 'X': arg = arg.toString(16).toUpperCase(); break;
                }
                arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);                
                let pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                let pad_length = match[6] - String(arg).length;
                let pad = match[6] ? this.strRepeat(pad_character, pad_length) : '';
                output.push(match[5] ? arg + pad : pad + arg);
            }
        }
        return output.join('');
    }
    
    public sprintf(message: string, ...args: any[]): string {
        if (!this.cache.hasOwnProperty(message))
            this.cache[message] = this.parseFormat(message);

        return this.format(this.cache[message], args);
    }
}


angular
    .module('pipFormat', [])
    .service('pipFormat', Format);
