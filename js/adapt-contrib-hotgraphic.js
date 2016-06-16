define([
    'coreJS/adapt',
    'core/js/models/componentItemsModel',
    './hotgraphicView'
], function(Adapt, ComponentItemsModel, HotgraphicView) {

    return Adapt.register('hotgraphic', {
        view: HotgraphicView,
        // Use the ComponentItemsModel directly - no need to extend
        model: ComponentItemsModel
    });

});
