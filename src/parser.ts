//TODO - It's a basic regex parser, improvements require

export function parse(text : string, pos : number) {
    let moduleName;

    let re = / .*?from\s|(= |')(.*?)(\(|')/g;
    let str = text;
    let matched;
    while ((matched = re.exec(str)) != null) {
        if (matched.index <= pos && pos <= re.lastIndex) {
            moduleName = matched[2];
            break;
        }
    }

    return moduleName;
}
