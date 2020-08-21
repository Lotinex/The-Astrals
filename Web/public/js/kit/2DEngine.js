const VIEW = Shell.Access('#engine-view'); //원한다면 NotNullAccess
if (VIEW === null)
    console.error(L.render('...')); //FIXME: lang error render
class Render2DEngine {
    constructor(id) {
        if (Controller.get(VIEW))
            return;
    }
}
Render2DEngine.ENGINE_CLASS = 'engine';
