myApp.controller('ElementController', ['$http', function($http) {
    const self = this;
    console.log('element controller loaded');

    self.newElement = [{value: 'element 1'},{value: 'element 2;'},{value: 'element 3'}];

    self.elementsList = [];

    self.saveElement = function() {
        $http.post('/api/element', { content: self.newElement })
            .then(response => {
                console.log(response);
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
        $http.get('/api/element')
            .then(response => {
                console.log(response);
                self.elementsList = response.data;
            })
            .catch(error => {
                console.log('error in get', response);
            })
    };
    self.getElements();
}]);