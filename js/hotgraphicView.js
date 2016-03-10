define([
    'core/js/adapt',
    'core/js/views/componentDiffView',
    './hotgraphicPopupView'
], function(Adapt, ComponentDiffView, HotGraphicPopupView) {

    var HotGraphicView = ComponentDiffView.extend({

        renderAttributes: [
            "displayTitle",
            "body",
            "title",
            "instruction",
            "_useGraphicsAsPins",
            "_currentIndex",
            "_items",
            "_graphic",
            "_isComplete",
            "_canCycleThroughPagination"
        ],

        renderOnInitialize: false,

        hasChildren: true,

        isVisibleTop: false,
        isVisibleBottom: false,

        completionEvent: null,

        postInitialize: function() {

            var shouldReplaceWithNarrative = (Adapt.device.screenSize !== 'large');
            if (shouldReplaceWithNarrative) {
                return this.replaceWithNarrative();
            };

            this.completionEvent = (this.model.get('_setCompletionOn') || 'allItems');

            this.model.checkIfResetOnRevisit();
            this.setUpEventListeners();
            this.render();
        },

        replaceWithNarrative: function() {
            if (this._isRemoved) return;

            if (!Adapt.componentStore.narrative) throw "Narrative not included in build";
            var Narrative = Adapt.componentStore.narrative;

            this.model.set({
                "_component": "narrative",
                "_wasHotgraphic": true
            });

            var narrativeView = new Narrative.view({ 
                "model": this.model 
            });

            var $container = $(".component-container", $("." + this.model.get("_parentId")));

            $container.append(narrativeView.$el);

            this.remove();
        },

        setUpEventListeners: function() {

            this.listenTo(Adapt, 'device:changed', this.onDeviceChanged, this);
            
            if (this.completionEvent === 'inview') {
                this.$el.on('inview', '.component-widget', _.bind(this.inview, this));
                return;
            }

            this.listenToOnce(this.model, this.completionEvent, this.onCompletion, this);

        },

        onDeviceChanged: function() {
            var shouldReplaceWithNarrative = (Adapt.device.screenSize !== 'large');
            if (shouldReplaceWithNarrative) {
                return this.replaceWithNarrative();
            };
        },

        events: {
            "click .hotgraphic-graphic-pin": "openHotGraphic"
        },

        postRender: function(isFirstRender) {
            if (!isFirstRender) return;
            
            this.$('.hotgraphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },        

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (!visible) return;

            switch (visiblePartY) {
            case 'top':
                this.isVisibleTop = true;
                break;
            case 'bottom':
                this.isVisibleBottom = true;
                break;
            case 'both':
                this.isVisibleTop = true;
                this.isVisibleBottom = true;
                break;
            }

            if (!this.isVisibleTop || !this.isVisibleBottom) return;

            this.$el.off('inview', '.component-widget');

            this.setCompletionStatus();

        },

        openHotGraphic: function (event) {
            event.preventDefault();

            var currentIndex = $(event.currentTarget).data('id');
            this.state.set("_currentIndex", currentIndex);

            var popupView = new HotGraphicPopupView({
                model: this.model, 
                state:this.state,
                parentView: this
            });
        },

        onCompletion: function() {
            this.setCompletionStatus();

            if (this.completionEvent === 'inview') return;
            
            this.stopListening(this.model, this.completionEvent);
        }

    });

    return HotGraphicView;

});
