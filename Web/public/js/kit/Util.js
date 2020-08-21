/**
 * 만약 jQuery 등의 라이브러리를 사용한다면 이곳의 기능은 필요가 없을수도 있습니다.
 * jQuery 등의 라이브러리와 겹치치 않도록 HTMLElement 등에 직접 메소드를 심는 방법을 피했습니다.
 *
 * 대부분의 함수는 엘리먼트에 접근해야 할 때 넘겨진 문자열로 get 함수를 호출합니다.
 *
 * 그게 아니면 직접 인자로 엘리먼트 객체를 넘겨받습니다.
 */
class DOM {
    /**
     * 엘리먼트에 접근한다.
     * @param {string} id 엘리먼트의 식별자
     * @returns {HTMLElement}
     */
    static get(id) {
        return document.querySelector(id);
    }
    /**
     * id에 해당하는 모든 엘리먼트에 접근한다.
     * @param {string} id 엘리먼트의 식별자
     * @returns {NodeListOf<any>}
     */
    static all(id) {
        return document.querySelectorAll(id);
    }
    /**
     * HTMLElement의 ...px 문자열을 순수 숫자로 반환한다.
     * @param {string} value ...px 형태의 string 값
     */
    static numOfPx(value) {
        return Number(value.replace('px', ''));
    }
    /**
     * 대상의 내용을 비운다.
     * @param {string} targetID 대상 id
     */
    static blank(targetID) {
        DOM.get(targetID).innerHTML = '';
    }
    /**
     * 해당 이미지의 경로를 설정한다.
     * @param {string} id 대상 id
     * @param {string} src 경로
     */
    static setImgSrc(id, src) {
        if (src === null)
            DOM.get(id).removeAttribute('src');
        else
            DOM.get(id).setAttribute('src', `assets/img/${src}`);
    }
    /**
     * 엘리먼트에 접근하여 위치를 절대 위치 또는 상대 위치로 바꾼다.
     * @param {string} targetID 옮길 대상
     * @param {string} left left에 대한 절대 또는 상대 위치
     * @param {string} top top에 대한 절대 또는 상대 위치
     * @returns {HTMLElement}
     */
    static positionAs(targetID, left, top) {
        let targetElement = DOM.get(targetID);
        let leftLocation, topLocation;
        if (left.toString().match(/~\d+/)) {
            leftLocation = `${numOfPx(targetElement.style.left) + Number(left.replace('~', ''))}px`;
        }
        else if (left === '~') {
            leftLocation = targetElement.style.left;
        }
        else {
            leftLocation = `${left}px`;
        }
        if (top.toString().match(/~\d+/)) {
            topLocation = `${numOfPx(targetElement.style.top) + Number(top.replace('~', ''))}px`;
        }
        else if (top === '~') {
            topLocation = targetElement.style.top;
        }
        else {
            topLocation = `${top}px`;
        }
        targetElement.style.left = leftLocation;
        targetElement.style.top = topLocation;
        return targetElement;
    }
    /**
     * 대상 엘리먼트를 숨긴다.
     * @param {string} targetID 숨길 대상
     * @returns {HTMLElement}
     */
    static hide(targetID) {
        DOM.get(targetID).style.display = 'none';
        return DOM.get(targetID);
    }
    /**
     * 대상 엘리먼트를 보인다
     * @param {string} targetID 보일 대상
     * @returns {HTMLElement}
     */
    static show(targetID) {
        DOM.get(targetID).style.display = 'block';
        return DOM.get(targetID);
    }
}
/**
 * 이 클래스는 메서드 체이닝(Method chaining) 기법을 사용합니다.
 */
class DynamicElement {
    /**
     * @param {string} tag 새 엘리먼트의 태그
     */
    constructor(tag) {
        /**
         * @private
         */
        this._element = document.createElement(tag);
    }
    /**
     * 어트리뷰트를 설정한다.
     * @param {string} attr 어트리뷰트 이름
     * @param {any} value 어트리뷰트 값
     */
    attr(attr, value) {
        this._element.setAttribute(attr, value);
        return this;
    }
    /**
     * 이 엘리먼트를 다른 엘리먼트에게 append한다.
     * @param {string} id 대상 엘리먼트 식별자
     */
    addTo(id) {
        DOM.get(id).appendChild(this._element);
        return this;
    }
    /**
     * 이 엘리먼트를 다른 엘리먼트의 내용으로 삼는다.
     * @param {string} id 대상 엘리먼트 식별자
     */
    setTo(id) {
        DOM.get(id).children = this._element;
        return this;
    }
    /**
     * innerHTML을 설정한다.
     * @param {string} value 값
     */
    injectHtml(value) {
        this._element.innerHTML = value;
        return this;
    }
    /**
     * innerText를 설정한다.
     * @param {string} value 값
     */
    injectText(value) {
        this._element.innerText = value;
        return this;
    }
    /**
     * 이 엘리먼트에 새 자식 요소를 append한다.
     * @param {any} child 새 자식 요소
     */
    insert(child) {
        this._element.append(child);
        return this;
    }
    /**
     * 이벤트를 등록한다.
     * @param {string} event 등록할 이벤트
     * @param {(...any) => void} cb 콜백 함수
     */
    register(event, cb) {
        this._element.addEventListener(event, cb);
        return this;
    }
    /**
     * 이 엘리먼트를 화면에서 제거한다.
     */
    kill() {
        this._element.parentNode.removeChild(this._element);
        //여기가 이 엘리먼트의 생명주기(Method chaining)의 끝 지점이다.
    }
    /**
     * element를 얻기 위해 사용한다.
     */
    get entity() {
        return this._element;
    }
}
class Util {
    static random(start, end){
        return Math.floor((Math.random() * (end-start+1)) + start);
    }
    static wait(sec){
        return new Promise(rs => {
            setTimeout(rs, sec * 1000)
        })
    }
}