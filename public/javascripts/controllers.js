angular.module('cs411', ['ngRoute', 'ngCookies'])
    .directive('nameDisplay', function () {
        return {
            scope: true,
            restrict: 'EA',
            template: "<b>This can be anything {{name}}</b>"
        }
    })
    //create default values for woeid,VIDEOS,TREND,choose,and initial.
    .controller('cs411ctrl', function ($scope, $http, $cookies) {
        $scope.woeid=0
        $scope.VIDEOS=[{link:"http://localhost",title:"default"}]
        $scope.TREND="None"
        $scope.choose=0
        $scope.initial=""
        $scope.mystyle = {
            "color": "black",
        }


            //CREATE (POST)
        $scope.createUser = function () {
            if ($scope.dbID) {
                $scope.updateUser($scope.dbID)
            }
            else {
                const request = {
                    method: 'post',
                    url: 'http://localhost:3000/api/db',
                    data: {
                        name: $scope.name,
                        location: $scope.location,
                        Woeid: $scope.Woeid
                    }
                }
                $http(request)
                    .then(function (response) {
                            $scope.inputForm.$setPristine()
                            $scope.name = $scope.location = $scope.Woeid = ''
                            $scope.getUsers()
                            console.log(response)
                        },
                        function (error) {
                            if (error.status === 401) {
                                $scope.authorized = false
                                $scope.h2message = "Not authorized to add "
                                console.log(error)
                            }
                        }
                    )
            }
        }
        //READ (GET)
        $scope.getUsers = function () {
            $http.get('http://localhost:3000/api/db')
                .then(function (response) {
                    $scope.users = response.data

                })
        }
        //UPDATE (PUT)
        $scope.setUserUpdate = function (user) {
            $scope.buttonMessage = "Update User"
            $scope.h2message = "Updating "
            $scope.name = user.name
            $scope.location = user.location
            $scope.dbID = user._id
            $scope.Woeid = user.Woeid

        }
        $scope.updateUser = function (userID) {
            const request = {
                method: 'put',
                url: 'http://localhost:3000/api/db/' + userID,
                data: {
                    name: $scope.name,
                    location: $scope.location,
                    Woeid: $scope.Woeid,
                    _id: userID
                }
            }
            $http(request)
                .then(function (response) {
                    $scope.inputForm.$setPristine()
                    $scope.name = $scope.location = $scope.Woeid = ''
                    $scope.h2message = "Add user"
                    $scope.buttonMessage = "Add User"
                    $scope.getUsers()
                    $scope.dbID = null
                })

        }

        //DELETE (DELETE)
        $scope.deleteUser = function (_id) {

            const request = {
                method: 'delete',
                url: 'http://localhost:3000/api/db/' + _id,
            }
            $http(request)
                .then(function (response) {
                        $scope.inputForm.$setPristine()
                        $scope.name = $scope.location = $scope.Woeid = ''
                        $scope.getUsers()
                    }
                )
        }
        //get trending topics by sending request to the backend's twitterapi with woeid,
        //and then use the topics to search for youtube videos by calling youtubeapi from
        //the backend.
        $scope.showVideos = function (id)  {
            $scope.hide=false
            $scope.hidea=true
            $http.get('http://localhost:3000/twitterapi/'+id).then(function(response){
                $scope.initial = response.data[0].trends[$scope.choose].name[0]
                if($scope.initial=="#") {
                    $scope.TREND = response.data[0].trends[$scope.choose].name.slice(1)
                }
                else{
                    $scope.TREND = response.data[0].trends[$scope.choose].name
                }
                $http.get('http://localhost:3000/youtubeapi/' + $scope.TREND )
                            .then(function (response) {
                                $scope.VIDEOS = response.data
            })

        })}
        //get trending topics by sending request to the backend's twitterapi with woeid
        $scope.showTwitters = function(id){
            $scope.hidea=false
            $scope.hide=true
            $http.get('http://localhost:3000/twitterapi/'+id).then(function(response){
                $scope.TREND=response.data[0].trends
            })}







        //initialize the values in the $scope object.
        $scope.initApp = function ( ) {
            $scope.buttonState = "create"
            $scope.h2message = "Add user"
            $scope.buttonMessage = "Add User"
            $scope.authorized =false
            $scope.showLogin =false
            $scope.hide=true
            $scope.hidea=true
            $scope.getUsers()
            //Grab cookies if present
            let authCookie=$cookies.get('authStatus')
            $scope.authorized=!!authCookie

        }

        $scope.logout = function () {
            $http.get('/auth/logout')
                .then(function (response) {
                    $scope.authorized = false
                })
        }
        $scope.login = function () {
            const request = {
                method: 'post',
                url: 'http://localhost:3000/auth/login',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            }
            $http(request)
                .then(function (response) {
                        $scope.authorized = true
                        $scope.showLogin = false
                    },
                    function (err) {
                        $scope.authorized = false
                    }
                )
        }

        $scope.register = function () {

            const request = {
                method: 'post',
                url: '/auth/register',
                data: {
                    name: $scope.name,
                    username: $scope.username,
                    password: $scope.password
                }
            }
            $http(request)
                .then(function (response) {
                        $scope.authorized = true
                        $scope.showLogin = false
                    },
                    function (error) {
                        if (error.status === 401) {
                            $scope.authorized = false
                            $scope.h2message = "Error registering"
                            console.log(error)
                        }
                    }
                )
        }

        $scope.showLoginForm = function () {
            $scope.showLogin = true
        }
        
        $scope.doTwitterAuth = function () {
            var openUrl = '/auth/twitter/'
            //Total hack, this:
            $scope.authorized = true
            window.location.replace(openUrl)

        }


    })
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/:status', {
                templateUrl: '',
                controller: 'authController'
            })
                .when(':status', {
                    templateUrl: '',
                    controller: 'authController'
                })
            .otherwise({
                redirectTo: '/'
            })
        }])


.controller('authController', function ($scope) {

    let authStatus =  $location.search();
    console.log(authStatus)
    console.log('In authController')
    $scope.authorized = !!authStatus

})


//This controller handles toggling the display of details in the user list
.controller('listController', function ($scope) {
    $scope.display = false

    $scope.showInfo = function () {
        $scope.display = !$scope.display

    }
})
