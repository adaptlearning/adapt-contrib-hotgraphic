define([
    'core/js/adapt',
    'core/js/views/diffView'
], function(Adapt, DiffView) {

    var HotGraphicPopup = DiffView.extend({

        renderAttributes: [
            "_hidePagination",
            "_currentPosition",
            "_currentIndex",
            "_isPopupShown"
        ],

        className: function() {
            return this.normalizeClassNames([
                "hotgraphic-popup",
                this.state ? this.state.get("_popupClasses") : ""
            ]);
        },

        postInitialize: function() {
            Adapt.trigger('popup:opened',  this.$el);
        },

        events: {
            'click .hotgraphic-popup-done': 'closeHotGraphic',
            'click .hotgraphic-popup-nav .back': 'previousHotGraphic',
            'click .hotgraphic-popup-nav .next': 'nextHotGraphic'
        },

        preRender: function() {
            var currentIndex = this.state.get("_currentIndex");
            this.state.set("_isPopupShown", true);
            this.moveToIndex(currentIndex);
        },

        moveToIndex: function(index) {
            this.setVisited(index);

            this.state.set({
                "_currentIndex": index,
                "_currentPosition": index+1,
                "_total": this.model.getItemsCount()
            });

            this.setNavigationForItem(index);

            this.listenToOnce(this, "postRender",function () {
                this.$('.active').a11y_focus();
            });
        },

        setVisited: function(index) {
            var item = this.model.getItem(index);
            item._isVisited = true;

            $.a11y_alert("visited");
        },

        setNavigationForItem: function (index) {
            var itemsCount = this.model.getItemsCount();

            var allowCycle = this.model.get('_canCycleThroughPagination');
            var isFirst = (index <= 0);
            var isLast = (index >= itemsCount-1);
            var isMiddle = (!isFirst && !isLast);
            
            this.state.set({
                _isFirst: isFirst,
                _showNext: (allowCycle || isFirst || isMiddle),
                _isLast: isLast,
                _showBack: (allowCycle || isLast || isMiddle)
            });

            var itemClasses = this.model.getItem(index)._classes || '';

            var classes = this.normalizeClassNames('item-' + index + ' ' + itemClasses);

            this.state.set('_popupClasses', classes);
            this.$el.attr("class", this.className()); //reapply className to comtainer

        },

        previousHotGraphic: function (event) {
            event.preventDefault();

            var currentIndex = this.state.get("_currentIndex");
            var itemsCount = this.model.getItemsCount();

            var allowCycle = this.model.get('_canCycleThroughPagination');
            var isFirst = (currentIndex === 0);

            if (isFirst && !allowCycle) return;

            if (isFirst) {
                currentIndex = itemsCount;
            }

            this.moveToIndex(currentIndex-1);
        },

        nextHotGraphic: function (event) {
            event.preventDefault();

            var currentIndex = this.state.get("_currentIndex");
            var itemsCount = this.model.getItemsCount();

            var allowCycle = this.model.get('_canCycleThroughPagination');
            var isLast = (currentIndex === itemsCount-1);

            if (isLast && !allowCycle) return;

            if (isLast) {
                currentIndex = -1;
            }

            this.moveToIndex(currentIndex+1);
        },

        closeHotGraphic: function(event) {
            event.preventDefault();

            this.model.evaluateCompletion();

            this.state.set("_isPopupShown", false);
            Adapt.trigger('popup:closed');

            this.remove();
        }

    },{
        template: "hotgraphicPopup"
    });

    return HotGraphicPopup;

});
