define([
    'core/js/adapt',
    'core/js/models/itemsModel'
], function(Adapt, ItemsModel) {

    var HotgraphicModel = ItemsModel.extend({
        
        defaults: function() {
            return _.extend({
                _activeItem: -1,
                _isPopupOpen: false
            }, ItemsModel.prototype.defaults);
        },

        initialize: function() {
            this.set('_marginDir', 'left');
            if (Adapt.config.get('_defaultDirection') == 'rtl') {
                this.set('_marginDir', 'right');
            }
            this.set('_itemCount', this.get('_items').length);
        },

        prepareHotgraphicModel: function() {
            this.set('_activeItem', -1);
            this.set('_isPopupOpen', false);
            this.set('_component', 'hotgraphic');
            this.set('body', this.get('originalBody'));
            this.set('instruction', this.get('originalInstruction'));
            
            return this;
        },

        checkCompletionStatus: function() {
            ItemsModel.prototype.checkCompletionStatus.apply(this, arguments);

            if (this.getCompletionStatus()) {
                this.trigger('allItems');
            }
        }

    });

    return HotgraphicModel;

});