define([
    'core/js/adapt',
    './hotgraphicView',
    './hotgraphicModel'
], function(Adapt, HotgraphicView, HotgraphicModel) {

    return Adapt.register('hotgraphic', {
        view: HotgraphicView,
        model: HotgraphicModel
    });

});
