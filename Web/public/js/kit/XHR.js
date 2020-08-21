class XHR {
    constructor(option, response) {
        this.xhrObject = new XMLHttpRequest();
        this.xhrObject.open(option.method, option.url);
        this.xhrObject.addEventListener('load', response);
        this.xhrObject.send(option.value);
    }
    static request(option) {
        return new Promise((resolve, reject) => {
            new XHR(option, function (ev) {
                switch (this.status) {
                    case 200:
                        resolve(this.response);
                        break;
                    case 403:
                        reject("403 접근 거부됨");
                        break;
                    case 404:
                        reject("404 페이지 없음");
                        break;
                    case 500:
                        reject("500 서버 오류");
                        break;
                }
            });
        });
    }
    static ajax(option) {
        return XHR.request(option);
    }
}
XHR.ajax({
    method: 'POST',
    url: '/test',
    value: 'asdasfasd'
}).then(res => {
    console.log(res);
});
