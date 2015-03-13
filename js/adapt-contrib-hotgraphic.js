/*
 * adapt-contrib-hotgraphic
 * License - http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Kevin Corry <kevinc@learningpool.com>, Daryl Hedley <darylhedley@hotmail.com>
 */
define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var HotGraphic = ComponentView.extend({

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, 'change:_isVisible', this.toggleVisibility);
            this.model.set('_globals', Adapt.course.get('_globals'));
            this.preRender();
            if (Adapt.device.screenSize == 'large') {
                this.render();
            } else {
                this.reRender();
            }
        },

        events: function() {
            return {
                'click .hotgraphic-graphic-pin': 'openHotGraphic',
                'click .hotgraphic-popup-done': 'closeHotGraphic',
                'click .hotgraphic-popup-nav .back': 'previousHotGraphic',
                'click .hotgraphic-popup-nav .next': 'nextHotGraphic'
            }
        },

        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.reRender, this);

            // Checks to see if the hotgraphic should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.renderState();
            this.$('.hotgraphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },

        // Used to check if the hotgraphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.set({
                    _isEnabled: true,
                    _isComplete: false
                });

                _.each(this.model.get('_items'), function(item) {
                    item._isVisited = false;
                });
            }
        },

        reRender: function() {
            if (Adapt.device.screenSize != 'large') {
                this.replaceWithNarrative();
            }
        },

        replaceWithNarrative: function() {
            var Narrative = require('components/adapt-contrib-narrative/js/adapt-contrib-narrative');
            var model = this.prepareNarrativeModel();
            var newNarrative = new Narrative({model: model, $parent: this.options.$parent});
            newNarrative.reRender();
            newNarrative.setupNarrative();
            this.options.$parent.append(newNarrative.$el);
            Adapt.trigger('device:resize');
            this.remove();
        },

        prepareNarrativeModel: function() {
            var model = this.model;
            model.set('_component', 'narrative');
            model.set('_wasHotgraphic', true);
            model.set('originalBody', model.get('body'));
            if (model.get('mobileBody')) {
                model.set('body', model.get('mobileBody'));
            }
            return model;
        },

        applyNavigationClasses: function (index) {
            var $nav = this.$('.hotgraphic-popup-nav'),
                itemCount = this.$('.hotgraphic-item').length;

            $nav.removeClass('first').removeClass('last');
            this.$('.hotgraphic-popup-done').a11y_cntrl_enabled(true);
            if(index <= 0) {
                this.$('.hotgraphic-popup-nav').addClass('first');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(false);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            } else if (index >= itemCount-1) {
                this.$('.hotgraphic-popup-nav').addClass('last');
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(false);
            } else {
                this.$('.hotgraphic-popup-controls.back').a11y_cntrl_enabled(true);
                this.$('.hotgraphic-popup-controls.next').a11y_cntrl_enabled(true);
            }
        },

        openHotGraphic: function (event) {
            event.preventDefault();
            this.$('.hotgraphic-popup-inner').a11y_on(false);
            var currentHotSpot = $(event.currentTarget).data('id');
            this.$('.hotgraphic-item').hide().removeClass('active');
            this.$('.'+currentHotSpot).show().addClass('active');
            var currentIndex = this.$('.hotgraphic-item.active').index();
            this.setVisited(currentIndex);
            this.$('.hotgraphic-popup-count .current').html(currentIndex+1);
            this.$('.hotgraphic-popup-count .total').html(this.$('.hotgraphic-item').length);
            this.$('.hotgraphic-popup').show();      
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
              
            Adapt.trigger('popup:opened',  this.$('.hotgraphic-popup-inner'));

            this.$('.hotgraphic-popup-inner .active').a11y_focus();
            this.applyNavigationClasses(currentIndex);
        },

        closeHotGraphic: function(event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            this.$('.hotgraphic-popup').hide();
            Adapt.trigger('popup:closed',  this.$('.hotgraphic-popup-inner'));
        },

        previousHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            if (currentIndex > 0) {
                this.$('.hotgraphic-item.active').hide().removeClass('active');
                this.$('.hotgraphic-item').eq(currentIndex-1).show().addClass('active');
                this.setVisited(currentIndex-1);
                this.$('.hotgraphic-popup-count .current').html(currentIndex);
                this.$('.hotgraphic-popup-inner').a11y_on(false);
            }
            this.applyNavigationClasses(currentIndex-1);
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        },

        nextHotGraphic: function (event) {
            event.preventDefault();
            var currentIndex = this.$('.hotgraphic-item.active').index();
            if (currentIndex < (this.$('.hotgraphic-item').length-1)) {
                this.$('.hotgraphic-item.active').hide().removeClass('active');
                this.$('.hotgraphic-item').eq(currentIndex+1).show().addClass('active');
                this.setVisited(currentIndex+1);
                this.$('.hotgraphic-popup-count .current').html(currentIndex+2);
                this.$('.hotgraphic-popup-inner').a11y_on(false);
            }
            this.applyNavigationClasses(currentIndex+1);
            this.$('.hotgraphic-popup-inner .active').a11y_on(true);
            this.$('.hotgraphic-popup-inner .active').a11y_focus();
        },

        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;
            this.$('.hotgraphic-graphic-pin').eq(index).addClass('visited').attr('aria-label', "Item visited.");
            $.a11y_alert("visited");
            this.checkCompletionStatus();
        },

        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        checkCompletionStatus: function() {
            if (!this.model.get('_isComplete')) {
                if (this.getVisitedItems().length == this.model.get('_items').length) {
                    this.setCompletionStatus();
                }
            }
        }

    });

    Adapt.register('hotgraphic', HotGraphic);

    return HotGraphic;

});
