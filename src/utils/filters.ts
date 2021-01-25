export function formatDate (date: any, fmt: any) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours()-8,
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (const k in o) {
        // console.info("k--------:",k)
        if (new RegExp(`(${k})`).test(fmt)) {

           /* const str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));*/
        }
    }
    return fmt;
}

function padLeftZero (str: any) {
    return ('00' + str).substr(str.length);
}
