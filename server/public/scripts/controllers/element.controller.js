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

    self.insertSection = function(position) {
        self.newElement.splice(position, 0, {value: ''});
        console.log('done', self.newElement);
    };
    self.removeSection = function(position) {
        self.newElement.splice(position, 1);
        console.log('done', self.newElement);
    };
    
    self.getElements = function() {
        console.log('in get request');
        $http.get('/api/element/' + $routeParams.id)
            .then(response => {
                self.element = response.data;
                console.log(self.element);
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
    self.insertSectionInElement = function(position) {
        self.element.content.splice(position, 0, {value: ''});
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