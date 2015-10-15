define(function(require) {
    var Backbone = require('backbone');

    HiddenHotspotsItemModel = Backbone.Model.extend({

        defaults: {
            _hasBeenUsed: false
        }

    });

    return HiddenHotspotsItemModel;

});