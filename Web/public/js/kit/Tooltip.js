const TOOLTIP = {
    text: { trigger: 'tt-text', renderer: 'tooltip-text' },
    item: { trigger: 'tt-item', renderer: 'tooltip-item' },
    active: { trigger: 'tt-active', renderer: 'tooltip-item'},
};
const REPLACEMENT_TEXT = {
    "test": { name: "1" }
};
const TooltipState = {}
function getTooltipAdaptY(renderer){
    switch(renderer){
        case TOOLTIP.text.renderer:
            return 10;
        case TOOLTIP.item.renderer:
            return 120;
        default: //이럴 일은 사실 없어야 한다.
            return 50;
    }
}
/**
 * 새 툴팁 생성을 위한 함수
 * @typedef {keyof typeof TOOLTIP} keyofTooltip
 * @param {TOOLTIP[keyofTooltip]} type 툴팁 유형 (``트리거, 렌더러``)
 * @param {(id: string, e: MouseEvent) => void} onFn 툴팁이 표시될 때 취할 액션
 * @param {(id: string, e: MouseEvent) => void} offFn 툴팁이 꺼질 때 취할 액션
 */
function register(type, onFn, offFn) {
    document.addEventListener('mousemove', e => {
        if (e.target.hasAttribute(type.trigger)) {
            TooltipState[type.renderer] = true; //FIXME: 테스트
            if (type.trigger == 'tt-text')
                e.target.style.display = 'inline-block';
            let identifier = e.target.getAttribute(type.trigger);
            let tooltipID = `#${type.renderer}`;
            DOM.positionAs(tooltipID, e.pageX + 10, e.pageY - getTooltipAdaptY(type.renderer));
            DOM.show(tooltipID);
            onFn(identifier, e);
            e.target.addEventListener('mouseleave', e => {
                TooltipState[type.renderer] = false; //FIXME: 테스트
                /**
                 * 렌더링을 담당할 툴팁 엘리먼트에 따라
                 * 툴팁 표시를 마친 후 내용을 초기화한다.
                 */
                switch (type.renderer) {
                    case TOOLTIP.text.renderer:
                        DOM.blank(tooltipID);
                        break;
                    case TOOLTIP.item.renderer:
                        L.inject([
                            '#tt-item-title',
                            '#tt-item-info',
                            '#tt-item-ability'
                        ], null);
                        DOM.setImgSrc('#tt-item-view', null);
                        break;
                }
                DOM.hide(tooltipID);
                if (offFn)
                    offFn();
            });
        }
    });
}
function DEBUG_CanvasShapedEntityMouseOver(e, entityObject){
    console.log(`
    x : ${e.pageX}
    y : ${e.pageY}
    Ox : ${entityObject.x}
    Oy : ${entityObject.y}
    Ow : ${entityObject.w}

    horizontal-x-min-check : ${e.pageX >= (entityObject.x - (entityObject.w / 2))}
    horizontal-x-max-check : ${e.pageX <= (entityObject.x + (entityObject.w / 2))}

    vertical-y-min-check : ${e.pageY >= (entityObject.y - (entityObject.h / 2))}
    vertical-y-max-check : ${e.pageY <= (entityObject.y + (entityObject.h / 2))}

    `)
}
const validatedConditions = {}
function OnCanvasShapedEntity(entityID, renderer, onFn, offFn){
    document.addEventListener('mousemove', e => { //페이지 전체에 대해 마우스의 움직임을 감지한다.
        let entityObject;
        for(let o of shapedObjects){ //모든 shaped 개체에 대해
            if(o.id == `shapedEntity_${entityID}`) entityObject = o; //전달받은 id와 일치하는 놈을 현재 대상 개체로 삼는다.
        }
        let identifier = entityObject.id; //현재 개체의 id
        let tooltipID = `#${renderer}`; //화면에 표시될 담당 툴팁의 id

        if(entityObject.hasOwnProperty('radius')){ //만약 현재 개체가 원이면 width와 height을 반지름 * 2로 삼는다.
            entityObject.w = entityObject.radius * 2
            entityObject.h = entityObject.radius * 2
        }

        const horizontalMinCheck = e.pageX >= (entityObject.x - (entityObject.w / 2)); //최소 x값을 넘기는지
        const horizontalMaxCheck = e.pageX <= (entityObject.x + (entityObject.w / 2)); //최대 x값을 안 넘기는지
        const verticalMinCheck = e.pageY >= (entityObject.y - (entityObject.h / 2)); //최소 y값을 넘기는지
        const verticalMaxCheck = e.pageY <= (entityObject.y + (entityObject.h / 2)); //최대 y값을 안 넘기는지

        validatedConditions[entityObject.id] = { //검증된 조건 목록에 현재 개체의 id로 계산된 조건들을 넣어놓는다.
            horizontalMinCheck,
            horizontalMaxCheck,
            verticalMinCheck,
            verticalMaxCheck,
            id : identifier,
            cb : onFn, //FIXME: 테스트
            tooltipID, //FIXME: 테스트
        }
        const tooltipProcessState = {
            executed : false,
            tooltipID : null,
        }
        for(let k in validatedConditions){ //검증된 조건 목록에서
            let currentCondition = validatedConditions[k]
            // 조건이 모두 참이면 실행한다.
            if(currentCondition.horizontalMinCheck && currentCondition.horizontalMaxCheck && currentCondition.verticalMinCheck && currentCondition.verticalMaxCheck){
                DOM.positionAs(currentCondition.tooltipID, e.pageX + 10, e.pageY - getTooltipAdaptY(L.remove(currentCondition.tooltipID, '#'))); //대상 툴팁의 위치를 잡는다.
                DOM.show(currentCondition.tooltipID); //대상 툴팁을 보인다.
                currentCondition.cb(currentCondition.id, e); //넘겨받은 "활성화 상태일 때" 호출할 콜백 함수를 실행한다.
                tooltipProcessState.executed = true; //툴팁이 잘 그려졌다고 해준다.
                tooltipProcessState.tooltipID = currentCondition.tooltipID; //현재 툴팁의 id
            }
        }
        if(!tooltipProcessState.executed && !TooltipState[renderer]) { //일치하는 조건이 아무것도 없어 툴팁이 그려지지 않았을 때 (등록된 개체중 그 무엇도 마우스와 마주치치 않았을 때)
            switch (renderer) {  //넘겨받은 툴팁의 종류에 따라 그 내용을 적절히 비운다.
                case TOOLTIP.text.renderer:
                    DOM.blank('#tooltip-text');
                    break;
                case TOOLTIP.item.renderer:
                    L.inject([
                        '#tt-item-title',
                        '#tt-item-info',
                        '#tt-item-ability'
                    ], null);
                    DOM.setImgSrc('#tt-item-view', null);
                    break;
            }
            DOM.hide(`#${renderer}`); //대상 툴팁을 숨긴다.
            if (offFn) offFn(); //"비활성화 상태일 때" 호출할 콜백 함수를 실행한다.
        }
    })
}
const ungaSword = {
    health: 300
};
register(TOOLTIP.item, id => {
    L.inject([
        '#tt-item-title',
        '#tt-item-info',
        '#tt-item-ability'
    ], [
        L.render(`tooltip.item.${id}-name`),
        L.render(`tooltip.item.${id}-info`),
        LoSon.parseAbilityList(ungaSword)
    ]);
    DOM.setImgSrc('#tt-item-view', `${id}.png`);
});
register(TOOLTIP.text, id => {
    L.inject('#text-tooltip', L.render(`tooltip.${id}`, REPLACEMENT_TEXT[id]));
});
register(TOOLTIP.active, id => {
    L.inject([
        '#tt-item-title',
        '#tt-item-info',
        '#tt-item-ability'
    ], [
        L.render(`tooltip.active.${id}-name`),
        L.render(`tooltip.active.${id}-info`),
    ]);
})