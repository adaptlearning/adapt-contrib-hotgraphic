define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var HiddenHotspotsItem = Backbone.View.extend({

        tagName: 'button',

        className: 'hidden-hotspots-pin',

        events: {
            'click': 'onItemClicked'
        },

        onItemClicked: function(event) {
            event.preventDefault();
            if (this.componentModel.get("_isEnabled")) {
                this.model.set({_hasBeenUsed: false});
            }
        },

        initialize: function(options) {
            this.componentModel = options.componentModel;
            this.index = options.index;
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_hasBeenUsed', this.onHasBeenUsed);
            this.cleanUpModel();
            this.preRender()
            this.render();
        },

        cleanUpModel: function() {
            delete this.model.attributes._top;
            delete this.model.attributes._left;
            delete this.model.attributes._width;
            delete this.model.attributes._height;
        },

        preRender: function() {
            this.showOrHideItem();
        },

        render: function() {
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(this.data));
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
        },

        postRender: function() {

        },

        onHasBeenUsed: function() {
            this.showOrHideItem();
        },

        showOrHideItem: function() {
            if (this.model.get('_hasBeenUsed')) {
                this.$el.removeClass('display-none').css({
                    left: this.model.get('_currentLeft') - 25,
                    top: this.model.get('_currentTop') - 25
                });
            } else {
                this.$el.addClass('display-none');
            }

            // For testing purposes
            this.$('span').css({
                "color":"#000",
                "background-color": "#f0f0f8"
            }).html('l:'+this.model.get('_currentLeft')+'t:'+this.model.get('_currentTop'))
        }

    }, {
        template: 'hiddenHotspotsItem'
    });

    return HiddenHotspotsItem;

});