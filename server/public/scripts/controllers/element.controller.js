myApp.controller('ElementController', ['$http', '$routeParams', function($http, $routeParams) {
    const self = this;
    console.log('element controller loaded');

    self.newElement = [{value: ''}];

    self.elementsList = [];
    self.element = {};

    self.types = ['document', 'string'];
    self.selectedType;

    self.saveElement = function() {
        $http.post('/api/element', { content: self.newElement })
            .then(response => {
                console.log(response);
                self.newElement = [{value: ''}];
                self.getElements();
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Finds the element in the references object with the same ID, for externals.
    self.referenceLookup = function(references, id) {
        let foundItem = references.filter(function(object) {
            console.log('object:', object.element._id);
            console.log('id:', id);
            return object.element._id === id;
        });
        return foundItem[0].element;
    }

    self.insertSection = function(position) {
        self.newElement.splice(position, 0, {value: ''});
        console.log('done', self.newElement);
    };
    self.removeSection = function(position) {
        self.newElement.splice(position, 1);
        console.log('done', self.newElement);
    };

    self.topElement = {};
    self.topElementToSave = {};
    
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
    self.renderDisplayArray = function(results) {
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
    self.insertSectionInElement = function(position, element = self.topElementToSave) {
        // Inserts an element in the working array, but not the Display Array
        element.content.splice(position, 0, {value: ''});
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

    self.explodeSelection = function(position, element = self.topElementToSave) {
        // TODO: ADD the contents before the highlighted contents to this position.
        self.insertSectionInElement(position); // inserts new element
        // TODO: ADD the highlighted contents to that position;
        self.insertSectionInElement(position + 1); // inserts another new element right after that
        // TODO: ADD the contents after the highlights to that position;
    };

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