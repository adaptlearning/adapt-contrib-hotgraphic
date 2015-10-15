define(function(require) {

    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');
    var HiddenHotspotsItem = require('./adapt-contrib-hiddenHotspotsItem.js');
    var HiddenHotspotsItemModel = require('./adapt-contrib-hiddenHotspotsItemModel.js');
    var HiddenHotspotsZone = require('./adapt-contrib-hiddenHotspotsZone.js');

    var HiddenHotspots = QuestionView.extend({

        events: {
            'click .hidden-hotspots-graphic': 'onGraphicClicked',
            'click .show-zones': 'onShowZonesClicked'
        },
        // Interaction code
        onGraphicClicked: function(event) {
            event.preventDefault();
            var unusedItemModel = this.hasAvailableItems();
            if (unusedItemModel) {
                unusedItemModel.set({
                    _hasBeenUsed: true,
                    _currentLeft: (event.offsetX),
                    _currentTop: (event.offsetY)
                });
            }
        },

        onShowZonesClicked: function(event) {
            this.renderZones();
        },

        renderZones: function() {
            this.zones.each(function(itemModel, index) {
                this.$('.hidden-hotspots-widget').append(new HiddenHotspotsZone({
                    model: itemModel,
                    index: index
                }).$el)
            }, this);
        },

        hasAvailableItems: function() {
            return this.collection.findWhere({_hasBeenUsed: false});
        },

        // Used by the question to disable the question during submit and complete stages
        disableQuestion: function() {},

        // Used by the question to enable the question during interactions
        enableQuestion: function() {},

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function(type) {},

        // Left blank for question setup - should be used instead of preRender
        setupQuestion: function() {
            this.zones = new Backbone.Collection();
            this.zones.add(this.model.get('_items'));
            this.collection = new Backbone.Collection();
            this.collection.model = HiddenHotspotsItemModel;
            this.collection.add(this.model.get('_items'));
        },

        // Blank method used just like postRender is for presentational components
        onQuestionRendered: function() {
            this.renderItems();
            this.setReadyStatus();
        },

        renderItems: function() {
            this.collection.each(function(itemModel, index) {
                this.$('.hidden-hotspots-widget').append(new HiddenHotspotsItem({
                    componentModel: this.model,
                    model: itemModel,
                    index: index
                }).$el)
            }, this);
        },

        //////
        // Submit process
        ////

        // Triggered when the submit button is clicked
        onSubmitClicked: function() {

            // canSubmit is setup in questions and should return a boolean
            // If the question stops the user form submitting - show instruction error
            // and give a blank method, onCannotSubmit to the question
            if(!this.canSubmit()) {
                this.showInstructionError();
                this.onCannotSubmit();
                return;
            }

            // Used to update the amount of attempts the question has
            this.updateAttempts();

            // Used to set attributes on the model after being submitted
            // Also adds a class of submitted
            this.setQuestionAsSubmitted();

            // Used to remove instruction error that is set when
            // the user has interacted in the wrong way
            this.removeInstructionError();

            // Used to store the users answer for later
            // This is a blank method given to the question
            this.storeUserAnswer();

            // Used to set question as correct:true/false
            // Calls isCorrect which is blank for the question
            // to fill out and return a boolean
            this.markQuestion();

            // Used by the question to set the score on the model
            this.setScore();

            // Used by the question to display markings on the component
            this.showMarking();

            // Used to check if the question is complete
            // Triggers setCompletionStatus and adds class to widget
            this.checkQuestionCompletion();

            // Used to setup the feedback by checking against
            // question isCorrect or isPartlyCorrect
            this.setupFeedback();

            // Used to update buttonsView based upon question state
            // Update buttons happens before showFeedback to preserve tabindexes and after setupFeedback to allow buttons to use feedback attribute
            this.updateButtons();
            // Used to trigger an event so plugins can display feedback
            this.showFeedback();

        },

        // Use to check if the user is allowed to submit the question
        // Maybe the user has to select an item?
        canSubmit: function() {
            return true;
        },

        // Blank method for question to fill out when the question cannot be submitted
        onCannotSubmit: function() {},

        // This is important for returning or showing the users answer
        // This should preserve the state of the users answers
        storeUserAnswer: function() {
            this.model.set("_userAnswer", this.collection.toJSON());
        },

        // Should return a boolean based upon whether to question is correct or not
        isCorrect: function() {
            this.zones.each(function(zone) {
                console.log(zone.attributes);
                var zoneTopMax = zone.attributes._top + zone.attributes._height;
                var zoneTopMin = zone.attributes._top;
                var zoneLeftMax = zone.attributes._left + zone.attributes._width;
                var zoneLeftMin = zone.attributes._left;
                this.collection.each(function(item) {
                    
                    if (zone.get('_hasBeenUsed')) {
                        return;
                    }
                    
                    if (item.get('_hasBeenUsed')) {
                        var itemTopMax = item.attributes._currentTop + 25;
                        var itemTopMin = item.attributes._currentTop - 25;
                        var itemLeftMax = item.attributes._currentLeft + 25;
                        var itemLeftMin = item.attributes._currentLeft - 25;
                        console.log(zoneLeftMax, zoneLeftMin, zoneTopMax, zoneTopMin);
                        console.log(itemLeftMax, itemLeftMin, itemTopMax, itemTopMin);
                        var isInLeftArea = false;
                        var isInTopArea = false;


                        if ((itemLeftMax <= zoneLeftMax) && (itemLeftMax >= zoneLeftMin)) {
                            isInLeftArea = true;
                        }

                        if ((itemLeftMin <= zoneLeftMax) && (itemLeftMin >= zoneLeftMin)) {
                            isInLeftArea = true;
                        }

                        if ((itemTopMax <= zoneTopMax) && (itemTopMax >= zoneTopMin)) {
                            isInTopArea = true;
                        }

                        if ((itemTopMin <= zoneTopMax) && (itemTopMin >= zoneTopMin)) {
                            isInTopArea = true;
                        }

                        console.log(isInLeftArea, isInTopArea);

                        if (isInLeftArea && isInTopArea) {
                            console.log('is in!');
                            zone.set({
                                '_hasBeenUsed': true,
                                '_isCorrect': true
                            });
                        }
                    }

                }, this)
            }, this);

            var correctLength = this.zones.where({_isCorrect: true}).length;
            var itemLength = this.model.get('_items').length;

            if (correctLength === itemLength) {
                return true;
            } else {
                return false;
            }

        },

        // Used to set the score based upon the _questionWeight
        setScore: function() {
            console.log(this.model.attributes);
        },

        // This is important and should give the user feedback on how they answered the question
        // Normally done through ticks and crosses by adding classes
        showMarking: function() {},

        // Used by the question to determine if the question is incorrect or partly correct
        // Should return a boolean
        isPartlyCorrect: function() {},

        // Used by the question view to reset the stored user answer
        resetUserAnswer: function() {},

        // Used by the question view to reset the look and feel of the component.
        // This could also include resetting item data
        // This is triggered when the reset button is clicked so it shouldn't
        // be a full reset
        resetQuestion: function() {},

        // Used by the question to display the correct answer to the user
        showCorrectAnswer: function() {},

        // Used by the question to display the users answer and
        // hide the correct answer
        // Should use the values stored in storeUserAnswer
        hideCorrectAnswer: function() {}

    });

    Adapt.register('hiddenHotspots', HiddenHotspots);

    return HiddenHotspots;

});

/*, {
            "_left": 540,
            "_top": 340,
            "_shape": "circle",
            "_spread": 80
        }, {
            "_left": 825,
            "_top": 525,
            "_shape": "circle",
            "_spread": 50
        }*/
