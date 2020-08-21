class Shell {
    constructor(element) {
        /**
         * @type {HTMLElement}
         */
        this.kernel = element;
    }
    /**
     * 특정 엘리먼트에 querySelector로 접근한다. 
     * @param query querySelector로 넘겨질 인자
     */
    static Access(query) {
        return document.querySelector(query);
    }
    /**
     * 이 래퍼가 감싸고 있는 알맹이(실제 엘리먼트)
     */
    get entity() {
        return this.kernel;
    }
    subscribe(action, receiver){
        if(!Action.ReceiverTable.hasOwnProperty(action)){
            Action.ReceiverTable[action] = [ receiver ]
        } else {
        Action.ReceiverTable[action].push(receiver)
        }
    }
    lower(query) {
        return this.kernel.querySelector(query);
    }
    html(stringHTML) {
        this.kernel.innerHTML = stringHTML;
        return this;
    }
    text(stringText) {
        this.kernel.innerText = stringText;
        return this;
    }
    blank() {
        this.kernel.innerHTML = '';
        return this;
    }
    /**
     *
     * @param {string | number} left
     * @param {string | number} top
     */
    move(left, top) {
        let kernel = {
            left: L.numOfPx(this.kernel.style.left),
            top: L.numOfPx(this.kernel.style.top)
        };
        let [valueX, valueY] = [left, top];
        if (typeof valueX == 'string') {
            valueX = valueX.match(/~\d+/) ? (kernel.left + Number(L.remove(valueX, '~'))) : (kernel.left);
        }
        if (typeof valueY == 'string') {
            valueY = valueY.match(/~\d+/) ? (kernel.top + Number(L.remove(valueY, '~'))) : (kernel.top);
        }
        this.kernel.style.left = `${valueX}px`;
        this.kernel.style.top = `${valueY}px`;
        return this;
    }
    attr(attrName, value) {
        this.kernel.setAttribute(attrName, value);
        return this;
    }
    event(eventName, callback) {
        this.kernel.addEventListener(eventName, callback);
        return this;
    }
    insert(child) {
        this.kernel.append(child);
        return this;
    }
    /**
     * 이 엘리먼트의 생명주기의 마지막이다.
     */
    kill() {
        this.kernel.remove();
        // this.chainAble = false; 
        /*
           kill 메서드가 이 엘리먼트(this.kernel) 의 생명주기의 마지막 이므로
           chainAble을 falsy하게 만들어 이 뒤에 메서드를 더 호출하는것을 방지
        */
    }
}
class ControllerObjectList {
    constructor(controllerObject) {
        this.controllerObject = controllerObject;
    }
    each(callback) {
        let ControllerObject = {};
        for (let k in this.controllerObject) {
            ControllerObject[k] = Controller.get(this.controllerObject[k]);
        }
        callback(ControllerObject);
    }
}
class Controller extends Shell {
    constructor(element) {
        super(element);
    }
    static get(query) {
        switch (query.constructor) {
            case HTMLElement:
                return new Controller(query);
            case Array:
                let ControllerList = [];
                query.forEach((v) => {
                    ControllerList.push(new Controller(Shell.Access(v)));
                });
                return ControllerList;
            default:
                if (typeof query == 'string')
                    return new Controller(Shell.Access(query));
                else if (typeof query == 'object')
                    return new ControllerObjectList(query);
        }
    }
    static id(value) {
        return Controller.get(`#${value}`);
    }
}
class Creator extends Shell {
    constructor(tag) {
        super(document.createElement(tag));
    }
}