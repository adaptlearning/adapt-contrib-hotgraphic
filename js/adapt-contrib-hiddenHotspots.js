define(function(require) {

    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');

    var HiddenHotspots = QuestionView.extend({

        // Used by the question to disable the question during submit and complete stages
        disableQuestion: function() {},

        // Used by the question to enable the question during interactions
        enableQuestion: function() {},

        // Used by the question to reset the question when revisiting the component
        resetQuestionOnRevisit: function(type) {},

        // Left blank for question setup - should be used instead of preRender
        setupQuestion: function() {},

        // Blank method used just like postRender is for presentational components
        onQuestionRendered: function() {},

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
        canSubmit: function() {},

        // Blank method for question to fill out when the question cannot be submitted
        onCannotSubmit: function() {},

        // This is important for returning or showing the users answer
        // This should preserve the state of the users answers
        storeUserAnswer: function() {},

        // Should return a boolean based upon whether to question is correct or not
        isCorrect: function() {},

        // Used to set the score based upon the _questionWeight
        setScore: function() {},

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
