myApp.controller('ElementController', ['$http', '$routeParams', function($http, $routeParams) {
    const self = this;
    console.log('element controller loaded');


    // NEW FRONTEND VERSION

    // start with an object simulating what we'd get back from the server
    self.server = {};
    self.server.content = {
        "_id" : "5a82192680c8213fe7b1ad0c",
        "type" : "document",
        "content" : [
            {
                "value" : "Testing editing data."
            },
            {
                "external" : true,
                "src" : "5a8208a8c14a713d091ed05d"
            },
            {
                "external" : true,
                "src" : "5a834c7fde9f8a0cc741b391"
            }, 
            {
                "value" : '\n- asdfasdfasdf [ ]'
            }
        ],
        "references" : [ 
            "5a8208a8c14a713d091ed05d", 
            "5a834c7fde9f8a0cc741b391", 
            "5a830d869738e103ed2b79dd"
        ]
    };
    self.server.references = [
        { _id: "5a8208a8c14a713d091ed05d", value: "this is #1 external" },
        { _id: "5a834c7fde9f8a0cc741b391", value: "this is #2 external" }
    ]
    console.log('SERVER data', self.server);

    // loop through it to make the version we use in the view
    for (let i = 0; i < self.server.content.content.length; i++) {
        console.log('here');
        // if it is external
        if (self.server.content.content[i].external) {
            // find its server reference object
            // TODO: rewrite this so you access directly as ID's instead of traversing array
            for (let j = 0; j < self.server.references.length; j++) {
                if (self.server.content.content[i].src == self.server.references[j]._id) {
                    console.log(self.server.content.content[i], self.server.references[j])
                    self.server.content.content[i] = self.server.references[j];
                }
            }
        }
    }
    console.log('DISPLAY data', self.server);

    // loop through that to make the string we display on the DOM parsed in Markdown
    self.displayString = '';
    for (let i = 0; i < self.server.content.content.length; i++) {
        // add it to the DOM display string
        if (i == 0) {
            self.displayString += self.server.content.content[i].value;
        } else {
            self.displayString += ' ' + self.server.content.content[i].value;
        }
    }
    console.log('DISPLAY STRING', self.displayString);

    // display that version

    // make a button that allows you to edit it

    // when you click the button, replace the Markdown-parsed version with an
    // ng-repeat of strings with edit buttons

    // when you click the edit button, it changes the style of the current button to display
    // all the admin stuff and make it display as a block on its own line













    self.newElement = [{value: ''}];

    self.elementsList = [];
    self.element = {};

    self.types = ['document', 'string'];
    self.selectedType;

    // self.saveElement = function() {
    //     $http.post('/api/element', { content: self.newElement })
    //         .then(response => {
    //             console.log(response);
    //             self.newElement = [{value: ''}];
    //             self.getElements();
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // };

    // self.insertSection = function(position) {
    //     self.newElement.splice(position, 0, {value: ''});
    //     console.log('done', self.newElement);
    // };
    // self.removeSection = function(position) {
    //     self.newElement.splice(position, 1);
    //     console.log('done', self.newElement);
    // };

    self.topElement = {};
    self.topElementToSave = {};
    self.externalOptions = [false, true];

    self.getElements = function() {
        console.log('in get request');
        $http.get('/api/element/' + $routeParams.id)
            .then(response => {
                // have to copy it because slicing it messes up the response reference later
                self.element = response.data[0];
                console.log("element", self.element);
                self.renderDisplayArray(self.element);

            })
            .catch(error => {
                console.log('error in get', response);
            });
    };
    self.getElements();

    // takes the database results and merges them into the array the DOM sees
    self.renderDisplayArray = function(results = self.element) {
        console.log('element', self.element);

        // cleans up the Mongo object/array-nesting confusion;
        self.topElementToSave = self.element.element[0];
        console.log('SAVE', self.topElementToSave);
        self.topReferences = self.element.references;
        console.log('REFS', self.topReferences);

        // make a new object with same properties as the old one;
        // needs double declaration like this or it says "response" is not defined; apparently a problem with slice()
        self.topElementDisplayTemp = self.element.element[0];
        self.topElementDisplay = self.topElementDisplayTemp.content.slice();
        console.log('DISPLAY', self.topElementDisplay);
        console.log(self);

        // use JS Object references to combine the reference array with the actual array.
        for (let i = 0; i < self.topElementDisplay.length; i++) {
            // check to see if it's a referencing an external element
            if (self.topElementDisplay[i].external) {
                // replace that external element node with a reference to the actual node
                for (let j = 0; j < self.topReferences.length; j++) {
                    if (self.topReferences[j].element._id === self.topElementDisplay[i].src) {
                        self.topElementDisplay[i] = self.topReferences[j].element;
                    }
                }
            }
        }
    }

    // Inserts a new section at the specified index
    self.insertSectionInElement = function(position, element = self.topElementToSave, type = 'string') {

        // depending on if if the type is external or internal, add the appropriate value
        let template = {};
        if (type == 'string') {
            template.value = '';
        } else {
            template.external = true;
        }

        // Inserts an element in the working array, but not the Display Array
        element.content.splice(position, 0, template);
        // Update the Display Array to reflect the splice
        self.renderDisplayArray(self.element);
    };

    // Removes the current section from the element
    self.removeSectionFromElement = function(position, element = self.topElementToSave) {
        // Deletes an element in the working array, but not the Display Array
        element.content.splice(position, 1);
        // Update the Display Array to reflect the splice
        self.renderDisplayArray(self.element);

        // TODO: if it is a reference to the external element, loop through the whole current element to see if it occurs anywhere else;
        // if so, leave it alone; if not, delete it also from the element's array list that it uses to look stuff up.
    };

    // self.explodeSelection = function(position, element = self.topElementToSave) {
    //     // TODO: ADD the contents before the highlighted contents to this position.
    //     self.insertSectionInElement(position); // inserts new element
    //     // TODO: ADD the highlighted contents to that position;
    //     self.insertSectionInElement(position + 1); // inserts another new element right after that
    //     // TODO: ADD the contents after the highlights to that position;
    // };

    self.updateElement = function(element) {
        console.log('trying to save');
        console.log(element);
        $http.post('/api/element/' + element._id, element)
            .then(response => {
                console.log('successfully updated!!');
                self.getElements();
            })
            .catch(error => {
                console.log('error in update');
            });

        // TODO: Run through and delete from references array here!
    };


}]);

/*
function explodeSelection() {
        // Explodes selection on edit
        self.explodeSelection = function(sourceText) {

            // need to check if the selection is in the scope we're editing
            let text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
    
            let resultsArray = [];
    
            let i = 0;
            do {
                i = sourceText.indexOf(text, i);
                // only if the substring is in the string, push its index to results
                if(i > -1) {
                    resultsArray.push(i);
                    i++
                }
            } while (i > -1);
    
            return resultsArray;
        };
}
*/