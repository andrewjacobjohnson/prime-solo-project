myApp.controller('ElementController', ['$http', '$routeParams', function($http, $routeParams) {
    const self = this;
    console.log('element controller loaded');

    self.newElement = [{value: ''}];

    self.elementsList = [];
    self.element = {};

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

    // Explodes selection on edit
    self.explodeSelection = function(sourceText) {

        // need to check if the selection is in the scope we're editing
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }

        // var string = 'hi';
        // var regex = /[0-9a-zA-Z]/;
        // console.log(sourceText)
        // var count = (sourceText.match(new RegExp(text, 'gi')) || []);
        // console.log(count);

        let resultsArray = [];

        let f = 00;
        // while (i > 0 && f < 100) {
        //     i = sourceText.indexOf(text, i) + 1;
        //     resultsArray.push(i);
        //     console.log(resultsArray);
        //     f++
        // }

        // current position
        let i = 0;
        let stopSign = 1;
        do {
            i = sourceText.indexOf(text, i);
            // only if the substring is in the string, push its index to results
            if(i > -1) {
                resultsArray.push(i);
                i++
            }
        } while (i > -1); // if it wasn't in the results, stop the loop
        console.log(resultsArray);
        // while (i !== -1) {
            
        //     if (i > -1) {
                
        //     } else {
        //         break;
        //     }
        // }

        // console.log(i);

        // for (let i = 0; i < sourceText.length - 1 && i > 0; i) {
        //     console.log(i);
        //     i = sourceText.indexOf(text, i);
        //     resultsArray.push(i);
        // }

        return sourceText;
    };
}]);