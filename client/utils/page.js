import {format, name, slogan} from '../config'

export function  getTitle(page, pagename)
{
    let template = format[page]
    if (template === undefined) {
        template = format.page
    }
    const result = template.replace(/{name}/g, name)
        .replace(/{name}/g, name)
        .replace(/{slogan}/g, slogan)
        .replace(/{pagename}/g, pagename)
    return result;
}