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
                console.log('element', self.element);

                // cleans up the Mongo object/array-nesting confusion;
                self.topElementToSave = self.element.element[0];

                // make a new object with same properties as the old one;
                self.topElementDisplay = self.element.element[0];
                self.new = self.topElementDisplay;
                console.log('DISPLAY', self.new.content.slice());
                let cats = self.new.content.slice();
                cats[2] = 'hi';
                console.log('cats', cats);

                // use JS Object references to combine the reference array with the actual array.
                for (let i = 0; i < self.topElementDisplay.content.length; i++) {
                    // check to see if it's a referencing an external element
                    if (self.topElementDisplay.content[i].external) {
                        // replace that external element node with a reference to the actual node
                        for (let j = 0; j < self.element.references.length; j++) {
                            if (self.element.references[j].element._id === self.topElementDisplay.content[i].src) {
                                self.topElementDisplay.content[i] = self.element.references[j].element;
                            }
                        }
                    }
                }
                console.log(self.topElementDisplay);

            })
            .catch(error => {
                console.log('error in get', response);
            });
    };
    self.getElements();

    self.updateElement = function(element) {
        $http.post('/api/element/' + $routeParams.id, element)
            .then(response => {
                console.log('successfully updated!!');
                self.getElements();
            })
            .catch(error => {
                console.log('error in update');
            });
    };

    // Inserts a new section at the specified index
    self.insertSectionInElement = function(position, element) {
        console.log('hi');
        element.content.splice(position, 0, {value: ''});
        console.log('done', self.newElement);
    };

    // Removes the current section from the element
    self.removeSectionFromElement = function(position) {
        self.element.content.splice(position, 1);
        console.log('done', self.newElement);
    };

    self.explodeSelection = function(position) {
        self.insertSectionInElement(position); // inserts new element
        self.insertSectionInElement(position + 1); // inserts another new element right after that
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