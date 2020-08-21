class Action {
    static ReceiverTable = {}

    static trigger(action, ...data){
        Action.ReceiverTable[action].forEach(f => {
            f(...data)
        })
    }
}