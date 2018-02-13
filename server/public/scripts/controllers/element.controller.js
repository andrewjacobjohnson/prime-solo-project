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
}]);