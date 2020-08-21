class L {
    static useClientData(data) {
        console.log(L._info('trying to use client language object instead of server language object.'));
        if (typeof data == 'object') {
            LANG = data;
            console.log(L._info('setup finished.'));
        }
        else
            console.log(L._error(`Invalid type "${typeof data}".`));
    }
    static _error(text) {
        return `Lang#Error : ${text}`;
    }
    static _info(text) {
        return `Lang#Info : ${text}`;
    }
    static markdown(text, syntaxArray) {
        let mdMatch = text.match(new RegExp(`\\${syntaxArray[0].split('').join('\\')}(.*)\\${syntaxArray[1].split('').join('\\')}`, 'g')), tag = L.MD_ELEMENT_TYPE[syntaxArray.join('')];
        if (mdMatch) {
            mdMatch.forEach(ex => {
                let mdText = ex.replace(syntaxArray[0], '').replace(syntaxArray[1], '');
                text = text.replace(ex, `<${tag}${tag == 'div' ? ' class="inquiry"' : ''}>${mdText}</${tag}>`);
            });
            return text;
        }
        else
            return text;
    }
    static markdownALL() { }
    /*
        TODO: keyExpression 인자의 표현 방법이 LANG.json의 타입인 LanguageTable을 따르기 어려우므로 알고리즘 개선이 필요함.
     */
    static render(keyExpression, substituteObject) {
        if (!LANG)
            return L._error(L._LOAD_ERROR);
        let keys = keyExpression.split('.');
        let value = LANG;
        for (const k of keys) {
            if (!value.hasOwnProperty(k))
                break;
            value = value[k];
        }
        if (typeof value == "object")
            return L._error(L._RENDER_FAILED);
        if (!substituteObject)
            return value;
        for (const k in substituteObject) {
            let iconExpression = value.match(/\{#\S+\|\S+\}/);
            value = L.markdown(value, ['**', '**']);
            value = L.markdown(value, ['__', '__']);
            value = L.markdown(value, ['~~', '~~']);
            value = L.markdown(value, ['+', '+']);
            value = L.markdown(value, ['-', '-']);
            value = L.markdown(value, ['[', ']']);
            value = L.markdown(value, ['%', '%']);
            value = L.markdown(value, ['_', '_']);
            if (iconExpression)
                iconExpression.forEach(ex => {
                    let icon = ex.split('|')[0].replace('{#', '');
                    value = value.replace(ex, `<i class="${LANG.icons[icon]}"></i>${substituteObject[k]}`);
                });
            value = value.replace(`{${k}}`, substituteObject[k]);
        }
        return value;
    }
    static inject(targets, text) {
        if (targets instanceof Array && text instanceof Array) {
            targets.forEach((t, i) => DOM.get(t).innerHTML = text[i]);
        }
        else if (targets instanceof Array && text === null) {
            targets.forEach(t => DOM.get(t).innerHTML = '');
        }
        else {
            DOM.get(targets).innerHTML = text || '';
        }
        return DOM.get(targets);
    }
    static numOfPx(value) {
        return Number(value.replace('px', ''));
    }
    static remove(target, value) {
        return target.replace(value, '');
    }
    static parseRGB(rgbString){
        let RGBValues = L.remove(L.remove(rgbString, 'rgb('), ')').split(',');
        return {
            r : RGBValues[0],
            g : RGBValues[1],
            b : RGBValues[2]
        }
    }
    static debug(text){
        console.log("%cDEBUG" + "%c | " + `%c${text}`, 'background:black; color:white;', 'font-weight:bold;', 'color: red;')
    }
}
L._LOAD_ERROR = 'Language table is not defined. There may have been a communication problem.';
L._RENDER_FAILED = 'Template string not found.';
L.MD_ELEMENT_TYPE = {
    '%%': 'mark',
    '__': 'i',
    '****': 'strong',
    '____': 'u',
    '~~~~': 's',
    '++': 'sup',
    '--': 'sub',
    '[]': 'div'
};
L.SPECIAL_SYNTAX = {
    'IC': src => `<img class="icon" src="${src}">`,
    'FA': name => `<i class="fas fa-${name}"></i>`,
    'REF': ref => eval(ref)
};
class LoSon {
    static parseAbilityList(losonObject) {
        let elements = [];
        for (let k in losonObject) {
            elements.push(L.render(`tooltip.item-ability.${k}`, { value: losonObject[k] }));
        }
        return elements;
    }
    static parseItemAbility(losonObject) {
    }
}
