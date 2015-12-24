app.controller('ProfileController',['$http','$window','$scope','$rootScope','notify','$location','$state','storage','profilefactory',
	function($http,$window,$scope,$rootScope,notify,$location,$state,storage,profilefactory){

        // Users list
        $scope.user = [];
        $scope.formName = '#userForm';

        $($scope.formName).validationEngine('attach', {
            promptPosition: "topLeft",
            scroll: true
        });

        $scope.jQueryValidator = new Validator($scope.formName);

        // lookup data
        $scope.countries = [];
        $scope.states = [];
        $scope.departments = [];
        $scope.reportingto = [];
        $scope.allotteddistricts = [];
        $scope.allottedblocks = [];
        $scope.entityGroups = [{
            "value": 0,
            "text": "Select"
        },{
            "value": 1,
            "text": "Admin"
        },{
            "value": 2,
            "text": "Users"
        }];

        $scope.recruitementType = [{
            "value": 0,
            "text": "Select"
        },{
            "value": 1,
            "text": "Direct"
        },{
            "value": 2,
            "text": "Retired"
        }];

        $scope.Genders = [{
            "value": 0,
            "text": "Select"
        },{
            "value": 1,
            "text": "Male"
        },{
            "value": 2,
            "text": "Female"
        }];        
        // default options

        $scope.defaultStates = {
            "value": 0,
            "text": "Select"
        };
        $scope.defaultCountries = {
            "value": 0,
            "text": "Select"
        };        
        $scope.defaultRecruitementType ={
            "value": 0,
            "text": "Select"
        };
        $scope.defaultBlocks = {
            "value": 0,
            "text": "Select"
        };   
       $scope.defaultDistricts = {
            "value": 0,
            "text": "Select"
        };
       $scope.defaultReportingTo = {
            "value": 0,
            "text": "Select"
        };
       $scope.defaultDepartments = {
            "value": 0,
            "text": "Select"
        };
       $scope.defaultEntityGroups = {
            "value": 0,
            "text": "Select"
        }; 
       $scope.defaultGenders = {
            "value": 0,
            "text": "Select"
        };

        // user info
        $scope.user = {
        "id": null,
        "email": null,
        "password": null,
        "description": null,
        "experience": null,
        "modifiedBy": $rootScope.sessionConfig.userId,
        "createdBy":  $rootScope.sessionConfig.userId,
        "countryId":  null,
        "stateId": null,
        "bloodGroupId": 1,
        "screenName": null,
        "firstName": null,
        "lastName": null,
        "genderId": null,
        "jobTitle": null,
        "teamName": null,
        "employeeId": null,
        "imageName": null,
        "imageId": null,
        "gmailId": null,
        "skypeName": null,
        "fatherName": null,
        "isLocked": false,
        "isActive": true,
        "createDate": null,
        "stateName": null,
        "deptName": null,
        "modifiedDate": null,
        "createdByName": null,
        "modifiedByName": null,
        "hasReadTermsAndCondtion": true,
        "userGroupId": null,
        "dateOfJoining": null,
        "departmentId": null,
        "reportingId": null,
        "allottedDistrict": null,
        "allottedBlock": null,
        "recruitmentId": null,
        "communicationAddress": null,
        "permanentAddress": null,
        "sameAddress": false,
        "dateOfBirth": null,
        "previousExperience": null,
        "businessEmail": null,
        "personalEmail": null,
        "birthProofId": null,
        "validationCode": null,
        "visibleFields": null,
        "mobileNumber": null,
        "landLineNumber": null,
        "personalUrl": null,
        "failedLoginAttempts": null,
        "lastLoginDate": null,
        "countryName": null,
        "reportingTo": null,
        "bloodGroupName": null,
        "recruitementName": null,
        "birthProofName": null
      };

	function GetProfileInformation(){
        var response = profilefactory.GetUsers($rootScope.sessionConfig.userId);
        response.success(function(result){
            if(result instanceof Array){
            	$scope.user = result[0];
            }else{
				var messageTemplate = '<span>'+result.data+'</span>';
		  		notify({
		            messageTemplate: messageTemplate,
		            position: $rootScope.appConfig.notifyConfig.position,
		            scope:$scope
		        });
            }
        }).error(function(error,status){
	  		notify({
	            messageTemplate: 'unable to read profile information!.',
	            position: $rootScope.appConfig.notifyConfig.position,
	            scope:$scope
	        });
        });		
	}

    function GetLookupValues(type){
        profilefactory.getLookupValues(type).success(function(result){
            var defaultOptions = {
                "value": 0,
                "text": "Select"
            };
            if(result instanceof Array){
                if(type === 7){ // countries
                    $scope.countries.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.countries.push(result[i]);
                    }                           
                }else if(type === 1){ // blocks
                    $scope.allottedblocks.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.allottedblocks.push(result[i]);
                    } 
                }else if(type === 3){//states
                     $scope.states.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.states.push(result[i]);
                    }                    
                }else if(type === 8){//departments
                     $scope.departments.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.departments.push(result[i]);
                    }                    
                }else if(type === 15){//reportingto
                     $scope.reportingto.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.reportingto.push(result[i]);
                    }                    
                }else if(type === 2){//districts
                     $scope.allotteddistricts.push(defaultOptions);
                    for (var i=0; i<result.length; i++){
                        $scope.allotteddistricts.push(result[i]);
                    }                    
                }
            }else{
                notify({
                    messageTemplate: '<span>Unable to read look up values!!!</span>',
                    position: $rootScope.appConfig.notifyConfig.position,
                    scope:$scope
                });
            }
        }).error(function(error,status){
            notify({
                messageTemplate: '<span>Unable to read look up values!!!</span>',
                position: $rootScope.appConfig.notifyConfig.position,
                scope:$scope
            });
        })
    }

    GetLookupValues(2);
    GetLookupValues(15);
    GetLookupValues(8);
    GetLookupValues(3);
    GetLookupValues(1);
    GetLookupValues(7);

    // Get Profile Information
    GetProfileInformation();
}]);

app.factory('profilefactory',function($http,$q,$rootScope){

    var service = {};
    var crudServiceBaseUrl = $rootScope.appConfig.baseUrl;

    service.getLookupValues = function(id){
        return $http({
            method : 'GET',
            url : crudServiceBaseUrl + '/lookup/getlookup?id='+id
        });
    }

    service.GetUsers = function(id){
        return $http({
            method : 'GET',
            url : crudServiceBaseUrl + '/user/getlist?id='+id,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }   

    return service;

});