
const ws = new Socket();
const state = {
    readyForBuild : false,
}
function setState(name, value){
    if(!state.hasOwnProperty(name)) return new Error(`${name}은 올바른 상태가 아닙니다.`)
    state[name] = value || true;
}
var objects = [];
var shapedObjects = [];
Controller.get([
    '#space'
]).forEach(e => {
    e.attr('width', window.innerWidth)
    .attr('height', window.innerHeight)
})
/**
 * @type {CanvasRenderingContext2D}
 */
const MainRenderer = document.getElementById('space').getContext("2d")
for(let i=0; i<200; i++){
    shapedObjects.push(
        {
            type : 'far-star',
            style : '#ffffff',
            radius : Util.random(1,2),
            x : Util.random(0, window.innerWidth),
            y : Util.random(0, window.innerHeight)
        }
    )
}
function Title(value){
    let infoBox = document.createElement('div');

    infoBox.setAttribute('class', 'infoBox infoAppear')
    infoBox.style.display = 'flex'
    infoBox.innerText = value;
    infoBox.addEventListener('animationend', () => {
        setTimeout(() => {
            infoBox.setAttribute('class', 'infoBox infoDisappear')
            infoBox.addEventListener('animationend', () => infoBox.remove())
        }, 3000)
    })
    document.body.appendChild(infoBox)
}
class ImagedObject {
    constructor(img, x, y, w, h){
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    render(renderer){
        renderer.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}
class Planet {
    constructor(){

    }
    render(){

    }
    revolution(target, speed, radius){

    }
}
function revolution(locationObj, planet, speed, radius){
}
let testX = 0;
let testY = 0;
let spin = 0;
class Engine {
    static loop(){
        Engine.update();
        Engine.render();
        Engine.registerLoop();
    }
    static registerLoop(){
        window.requestAnimationFrame(Engine.loop);
    }
    static update(){
        for(let o of shapedObjects){
            switch(o.type){
                case 'star':
                    let currentColor = L.parseRGB(o.style)
                    if(currentColor.b <= 0){
                        o.style = `rgb(255,255,255)`
                    }
                    else o.style = `rgb(${currentColor.r - 0.7},${currentColor.g - 1.4},${currentColor.b - 3.5})`
                    break;
                case 'planet':
                    o.x = testX + Math.sin(spin) * 150;
                    o.y = testY + Math.cos(spin) * 150;
                    break;
            }
        }
        spin += 0.02 * -1;

    }
    static render(){
        MainRenderer.clearRect(0, 0, window.innerWidth, window.innerHeight)
        for(let o of shapedObjects){
            switch(o.type){
                case 'star':
                    MainRenderer.beginPath()
                    MainRenderer.fillStyle = o.style
                    MainRenderer.arc(o.x, o.y, o.radius, 0, Math.PI * 2)
                    MainRenderer.fill()
                    MainRenderer.closePath()
                    break;
                case 'far-star':
                    MainRenderer.beginPath()
                    MainRenderer.fillStyle = o.style
                    MainRenderer.arc(o.x, o.y, o.radius, 0, Math.PI * 2)
                    MainRenderer.fill()
                    MainRenderer.closePath()
                    break;
                case 'planet':
                    MainRenderer.beginPath()
                    MainRenderer.fillStyle = o.style
                    MainRenderer.arc(o.x, o.y, o.radius, 0, Math.PI * 2)
                    MainRenderer.fill()
                    MainRenderer.closePath()
                    break;

            }
        }
    }
}
Controller.get('#space').event('click', e => {
    if(state['readyForBuild']){
        switch(state['readyForBuild']){
            case 'createStar':
                let newStarID = shapedObjects.length + 1
                let newStarObject = {
                    id : `shapedEntity_${newStarID}`,
                    type : 'star',
                    style : 'rgb(255,255,255)',
                    x : e.pageX,
                    y : e.pageY,
                    radius : 30
                }
                testX = e.pageX
                testY = e.pageY
                shapedObjects.push(newStarObject)
                OnCanvasShapedEntity(newStarID, 'tooltip-item', id => {
                    L.inject([
                        '#tt-item-title',
                        '#tt-item-info',
                        '#tt-item-ability'
                    ], [
                        `이름 없는 항성 (${id})`,
                        "밝게 빛나고 있는 항성이다.",
                    ]);
                })
                setState('readyForBuild', false)
                break;
            case 'createPlanet':
                let newPlanetID = shapedObjects.length + 1
                let newPlanetObject = {
                    id : `shapedEntity_${newPlanetID}`,
                    type : 'planet',
                    style : 'rgb(130,104,33)',
                    x : e.pageX,
                    y : e.pageY,
                    radius : 5
                }
                shapedObjects.push(newPlanetObject)
                OnCanvasShapedEntity(newPlanetID, 'tooltip-text', id => {
                    L.inject(
                        '#tooltip-text',
                        L.render('tooltip.entity.planet', { id })
                     )
                })
                setState('readyForBuild', false)
                break;
        }
    }
})
Controller.get('#createStar').event('click', e => {
    setState('readyForBuild', 'createStar');
})
Controller.get('#createPlanet').event('click', e => {
    setState('readyForBuild', 'createPlanet')
})
Title('??? 구역');
(async () => {
    await Util.wait(2.5)
    toast('info', '우주 모의 실험소에 오신 것을 환영합니다.')
    await Util.wait(2.5)
    toast('warn', '창작 도중 페이지를 떠나면 저장되지 않습니다. 아직 저장 기능이 준비되지 않았습니다.')
})();
Engine.registerLoop();