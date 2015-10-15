define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var HiddenHotspotsZone = Backbone.View.extend({

        className: 'hidden-hotspots-zone',

        initialize: function() {
            console.log('HiddenHotspotsZone');
            this.preRender();
            this.render();
        },

        preRender: function() {
            this.setPosition();
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
        
        setPosition: function() {
            var top = this.model.get('_top');
            var left = this.model.get('_left');
            var width = this.model.get('_width');
            var height = this.model.get('_height');

            this.$el.css({
                left: left,
                top: top,
                width: width,
                height: height
            });

        }

    }, {
        template: 'hiddenHotspotsZone'
    });

    return HiddenHotspotsZone;

});