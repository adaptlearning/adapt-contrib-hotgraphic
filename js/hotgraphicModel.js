define([
    'core/js/adapt',
    'core/js/models/itemsModel'
], function(Adapt, ItemsModel) {

    var HotgraphicModel = ItemsModel.extend({

        initialize: function() {
            this.set({
                '_marginDir': 'left',
                '_isPopupOpen': false
            });
            if (Adapt.config.get('_defaultDirection') == 'rtl') {
                this.set('_marginDir', 'right');
            }
            this.set('_itemCount', this.get('_items').length);

            ItemsModel.prototype.initialize.apply(this, arguments);
        },

        prepareHotgraphicModel: function() {
            this.resetActiveItems(false);
            this.set('_isPopupOpen', false);
            this.set('_component', 'hotgraphic');
            this.set('body', this.get('originalBody'));
            this.set('instruction', this.get('originalInstruction'));
            
            return this;
        },

        checkCompletionStatus: function() {
            if (this.getCompletionStatus()) {
                this.trigger('allItems');
            }
        },

        reset: function(type, force) {
            this.set({
                _isPopupOpen: false
            });
            ItemsModel.prototype.reset.call(this, type, force);
        }

    });

    return HotgraphicModel;

});