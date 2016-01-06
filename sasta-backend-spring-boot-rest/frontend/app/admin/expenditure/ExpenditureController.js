app.controller('ExpenditureController',['$http','$window','$scope','$rootScope','notify','$location','$state','storage','expenditurefactory',
	function($http,$window,$scope,$rootScope,notify,$location,$state,storage,expenditurefactory){

		$scope.aufactory = expenditurefactory;
		$scope.crudServiceBaseUrl = $rootScope.appConfig.baseUrl;
		
	    //Popup Titles
	    $scope.modelDialogTitle = {
	    	AddAuditTitle : "Add Expenditure",
	    	EditAuditTitle : "Edit Expenditure"
	    };

		$scope.rounds = [];
		$scope.districts = [];
		$scope.blocks = [];
		$scope.villages = [];

		// default selected rounds
		$scope.defaultrounds = {
		    "value": 0,
		    "text": "Select"
		};

		// default selected rounds
		$scope.defaultdistricts = {
		    "value": 0,
		    "text": "Select"
		};

		// default selected rounds
		$scope.defaultblocks = {
		    "value": 0,
		    "text": "Select"
		};

		// default selected rounds
		$scope.defaultvillages = {
		    "value": 0,
		    "text": "Select"
		};


        $scope.kaddWindowOptions = {
            content: 'admin/expenditure/add.html',
            title: $scope.modelDialogTitle.AddAuditTitle,
            iframe: false,
            draggable: true,
            modal: true,
            resizable: true,
            visible: false,      
            animation: {
                close: {
                    effects: "fade:out"
                }
            },
            open : function() {
		        $($scope.AddAuditFormName).validationEngine('attach', {
		            promptPosition: "topLeft",
		            scroll: true
		        });         
		        $scope.addjQueryValidator = new Validator($scope.AddAuditFormName); 
            }
        };

        $scope.AddAuditFormName = '#frmAddAuditExpenditure';
        $scope.EditAuditFormName = '#frmEditAuditExpenditure';    

        $scope.keditWindowOptions = {
            content: 'admin/expenditure/edit.html',
            title: $scope.modelDialogTitle.EditAuditTitle,
            iframe: false,
            draggable: true,
            modal: true,
            resizable: false,
            visible: false,      
            animation: {
                close: {
                    effects: "fade:out"
                }
            },
            open : function(){
		        $($scope.EditAuditFormName).validationEngine('attach', {
		            promptPosition: "topLeft",
		            scroll: true
		        });		        
		        $scope.editjQueryValidator = new Validator($scope.EditAuditFormName);            	
            }
        };

        $scope.OpenAuditWindow = function($event){
        	$scope.addAuditWindow.wrapper.addClass("col-md-12 col-lg-12 no-padding auto-margin");
            
            $scope.doReset();
        	
            GetAudit(decodeURIComponent($location.search().aid)).done(function(result){
            	
            	$scope.addAuditWindow.center().open();
        	});
        }

        $scope.CloseAuditWindow  = function(){
            $scope.addAuditWindow.close();
        }

        $scope.OpenEditAuditWindow = function(){
			$scope.editAuditWindow.wrapper.addClass("col-md-12 col-lg-12 no-padding auto-margin");        	
            $scope.editAuditWindow.center().open();
        }

        $scope.CloseEditAuditWindow = function(){
            $scope.editAuditWindow.close();
        }

        $scope.doReset = function(){
        	$scope.expenditure = angular.copy($scope.defaultOptions);
        	$scope.editexpenditure =  angular.copy($scope.defaultOptions);
        }

        $scope.defaultOptions = {
	      "id" :  null,
			"stationary" :  null,
			"others" :  null,
			"createdByName" :  null,
			"modifiedByName" :  null,
			"createdDate" :  null,
			"auditDistrictId" :  null,
			"modifiedDate" :  null,
			"financialDescription" :  null,
			"financialYear" :  null,
			"status" :  null,
			"roundDescription" :  null,
			"districtName" :  null,
			"roundStartDate" :  null,
			"roundEndDate" :  null,
			"appReceivedCount" :  null,
			"attendedAppCount" :  null,
			"refreshmentCharges" :  null,
			"selectedVrpCount" :  null,
			"photographyCharges" :  null,
			"paidedAmount" :  null,
			"visitedVillageCount" :  null,
			"videosCharges" :  null,
			"createdBy" :  null,
			"roundId" :  null,
			"roundName" :  null,
			"vpName" :  null,
			"modifiedBy" :  null,
			"blockName" :  null,
			"auditId" :  1,
			"blockId" :  null,
			"vpId" :  null,
			"ppleafLets" :  null
	    };

	    $scope.expenditure = {
	      	"id" :  null,
			"stationary" :  null,
			"others" :  null,
			"createdByName" :  null,
			"modifiedByName" :  null,
			"createdDate" :  null,
			"auditDistrictId" :  null,
			"modifiedDate" :  null,
			"financialDescription" :  null,
			"financialYear" :  null,
			"status" :  null,
			"roundDescription" :  null,
			"districtName" :  null,
			"roundStartDate" :  null,
			"roundEndDate" :  null,
			"appReceivedCount" :  null,
			"attendedAppCount" :  null,
			"refreshmentCharges" :  null,
			"selectedVrpCount" :  null,
			"photographyCharges" :  null,
			"paidedAmount" :  null,
			"visitedVillageCount" :  null,
			"videosCharges" :  null,
			"createdBy" :  null,
			"roundId" :  null,
			"roundName" :  null,
			"vpName" :  null,
			"modifiedBy" :  null,
			"blockName" :  null,
			"auditId" :  1,
			"blockId" :  null,
			"vpId" :  null,
			"ppleafLets" :  null

	    };

	    $scope.Submit = function(){
	    	if($scope.addjQueryValidator.doValidate()){
		    	//$scope.expenditure.roundId = $scope.defaultrounds.value;
		    	//$scope.expenditure.auditDistrictId = $scope.defaultdistricts.value;
		    	//$scope.expenditure.blockId = $scope.defaultblocks.value;
		    	//$scope.expenditure.vpId = $scope.defaultvillages.value;

		    	//$scope.expenditure.startdate = '2015-12-25';
		    	//$scope.expenditure.enddate = '2015-12-25';
		    	//$scope.expenditure.gramasabhadate = '2015-12-25';
		    	$scope.expenditure.createdBy = $rootScope.sessionConfig.userId;

		    	var responseText = expenditurefactory.doSubmitData($scope.expenditure);
				responseText.success(function(result){
					if(result.status){
				  		notify({
				            messageTemplate: '<span>'+result.data+'</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });							
						// scope.grid is the widget reference
	  					$scope.grid.dataSource.read();
						$scope.CloseAuditWindow();
				        $scope.doReset();
			  		}else{
				  		notify({
				            messageTemplate: '<span>Unable to add audit!</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });
			  		}
				}).error(function(error,status){
			  		notify({
			            messageTemplate: '<span>Unable to add audit!</span>',
			            position: $rootScope.appConfig.notifyConfig.position,
			            scope:$scope
			        });
				});
	    	}
	    }

	    $scope.Delete = function(data){
	    	$scope.delData = angular.copy($scope.defaultOptions);
	    	$scope.delData.id = data.id;
	    	$scope.delData.status = false;

	    	$scope.delData.modifiedBy = $rootScope.sessionConfig.userId;

		    	var responseText = hlcommitteefactory.doUpdateData($scope.delData);
				responseText.success(function(result){
					if(result.status){
				  		notify({
				            messageTemplate: '<span>'+result.data+'</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });							
						// scope.grid is the widget reference
	  					$scope.grid.dataSource.read();
						$scope.CloseEditAuditWindow();
				        $scope.doReset();
			  		}else{
				  		notify({
				            messageTemplate: '<span>Unable to delete editexpenditure!.</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });	
			  		}
				}).error(function(error,status){
			  		notify({
			            messageTemplate: '<span>Unable to delete editexpenditure!.</span>',
			            position: $rootScope.appConfig.notifyConfig.position,
			            scope:$scope
			        });	
				});	

	    }


	    $scope.Update = function(){
			if($scope.editjQueryValidator.doValidate()){
		    	//$scope.editexpenditure.roundId = 1;// $scope.editdefaultrounds.value;
		    	//$scope.editexpenditure.auditDistrictId =1;// $scope.editdefaultdistricts.value;
		    	//$scope.editexpenditure.blockId =1;// $scope.editdefaultblocks.value;
		    	//$scope.editexpenditure.vpId =1;// $scope.editdefaultvillages.value;
		    	//$scope.editexpenditure.createdDate=null;
		    	//$scope.editexpenditure.modifiedDate=null;
		    	//$scope.editexpenditure.roundStartDate=null;
		    	//$scope.editexpenditure.roundEndDate=null;
				$scope.editexpenditure.modifiedBy = $rootScope.sessionConfig.userId;
				
		    	var responseText = expenditurefactory.doUpdateData($scope.editexpenditure);
				responseText.success(function(result){
					if(result.status){
				  		notify({
				            messageTemplate: '<span>'+result.data+'</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });							
						// scope.grid is the widget reference
	  					$scope.grid.dataSource.read();
						$scope.CloseEditAuditWindow();
				        $scope.doReset();
			  		}else{
				  		notify({
				            messageTemplate: '<span>Unable to update audit!.</span>',
				            position: $rootScope.appConfig.notifyConfig.position,
				            scope:$scope
				        });	
			  		}
				}).error(function(error,status){
			  		notify({
			            messageTemplate: '<span>Unable to update audit!.</span>',
			            position: $rootScope.appConfig.notifyConfig.position,
			            scope:$scope
			        });	
				});	 
			}
	    }

	    $scope.EditData = function(data){
	    	var r = jQuery.map( $scope.rounds, function( n, i ) {
				if(data.roundId === n.value)
			  		return n;
			});	  
			if(r instanceof Array){
				$scope.editdefaultrounds =  r[0];
			}else{
				$scope.editdefaultrounds = $scope.defaultrounds;
			}	  
			var d = jQuery.map( $scope.districts, function( n, i ) {
				if(data.auditDistrictId === n.value)
			  		return n;
			});	  
			if(d instanceof Array){
				$scope.editdefaultdistricts =  d[0];
			}else{
				$scope.editdefaultdistricts = $scope.defaultdistricts;
			}	  
			var b = jQuery.map( $scope.blocks, function( n, i ) {
				if(data.auditBlockId === n.value)
			  		return n;
			});	  
			if(b instanceof Array){
				$scope.editdefaultblocks =  b[0];
			}else{
				$scope.editdefaultblocks = $scope.defaultblocks;
			}	   
			var v = jQuery.map( $scope.villages, function( n, i ) {
				if(data.villagePanchayatId === n.value)
			  		return n;
			});	  
			if(v instanceof Array){
				$scope.editdefaultvillages =  v[0];
			}else{
				$scope.editdefaultvillages = $scope.defaultvillages;
			}	   	
	    	$scope.editexpenditure = {
				id : data.id,
				stationary : data.stationary,
				others : data.others,
				createdByName : data.createdByName,
				modifiedByName : data.modifiedByName,
				createdDate : data.createdDate,
				auditDistrictId : data.auditDistrictId,
				modifiedDate : data.modifiedDate,
				financialDescription : data.financialDescription,
				financialYear : data.financialYear,
				status : data.status,
				roundDescription : data.roundDescription,
				districtName : data.districtName,
				roundStartDate : data.roundStartDate,
				roundEndDate : data.roundEndDate,
				appReceivedCount : data.appReceivedCount,
				attendedAppCount : data.attendedAppCount,
				refreshmentCharges : data.refreshmentCharges,
				selectedVrpCount : data.selectedVrpCount,
				photographyCharges : data.photographyCharges,
				paidedAmount : data.paidedAmount,
				visitedVillageCount : data.visitedVillageCount,
				videosCharges : data.videosCharges,
				createdBy : data.createdBy,
				roundId : data.roundId,
				roundName : data.roundName,
				vpName : data.vpName,
				modifiedBy : data.modifiedBy,
				blockName : data.blockName,
				auditId : data.auditId,
				blockId : data.blockId,
				vpId : data.vpId,
				ppleafLets : data.ppleafLets

	    	};
	    	$scope.OpenEditAuditWindow();
	    }

	    $scope.gridOptions = {
	        columns: [ 
		        		{ field: "id", title:'Audit ID', hidden: true, editable : false },
		        		{ field: "roundName", title:'Round', editable : false  },
		        		{ field: "roundStartDate", title:'Start Date',editable: false,template: "#= kendo.toString(kendo.parseDate(new Date(roundStartDate), 'yyyy-MM-dd'), 'MM/dd/yyyy') #"  },
		        		{ field: "roundEndDate", title:'End Date',editable: false,template: "#= kendo.toString(kendo.parseDate(new Date(roundEndDate), 'yyyy-MM-dd'), 'MM/dd/yyyy') #"  },
		        		{ field: "districtName", title : "District", editable : false},
		        		{ field: "blockName", title : "Block", editable : false },
		        		{ field: "vpName", title : "Village", editable : false},
		        		{
 							title : "",
		                    width: '30px',
		                    template: kendo.template($("#toggle-template").html())
		                }
		        	],
	        pageable: true,
	        filterable :true,
	        groupable : true,
	        dataSource: {
	            pageSize: 5,
	            transport: {
	                read: function (e) {
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/expenditure/getlist'
				      }).
	                  success(function(data, status, headers, config) {
	                  	if(data.status)
	                      e.success(data.data)
	                  }).
	                  error(function(data, status, headers, config) {
	                  });
	              }
	           }
	        }
	    }

	    function GetAudit(id,type)
	    {
	    	var deffered = jQuery.Deferred();
	    	expenditurefactory.getAudit(id).success(function(result){
	    		

		    		$scope.expenditure.auditId= result.data.auditId;
		    		$scope.expenditure.roundId =result.data.roundId;
			    	$scope.expenditure.auditDistrictId =result.data.auditDistrictId;
			    	$scope.expenditure.blockId =result.data.auditBlockId;
			    	$scope.expenditure.vpId =result.data.villagePanchayatId;
					
	    		
				
		  		return deffered.resolve('Ok');
			}).error(function(error,status){
	  			notify({
		            messageTemplate: '<span>Unable to read look up values!!!</span>',
		            position: $rootScope.appConfig.notifyConfig.position,
		            scope:$scope
	        	});
			})
			return deffered.promise();

	    }

	    function GetLookupValues(type){
	    	expenditurefactory.getLookupValues(type).success(function(result){
	    		var defaultOptions = {
				    "value": 0,
				    "text": "Select"
				};
				if(result instanceof Array){
					if(type==13){
						$scope.rounds.push(defaultOptions);
						for (var i=0; i<result.length; i++){
						    $scope.rounds.push(result[i]);
						}	
					}
					else if(type==2)
					{
						$scope.districts.push(defaultOptions);
						for (var i=0; i<result.length; i++){
						    $scope.districts.push(result[i]);
						}	
					}
					else if(type==1)
					{
						$scope.blocks.push(defaultOptions);
						for (var i=0; i<result.length; i++){
						    $scope.blocks.push(result[i]);
						}	
					}
					else if(type==14)
					{
						$scope.villages.push(defaultOptions);
						for (var i=0; i<result.length; i++){
						    $scope.villages.push(result[i]);
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

		//GetLookupValues(13); 
		//GetLookupValues(2); 
		//GetLookupValues(1); 
		//GetLookupValues(14); 
}]);

app.factory('expenditurefactory',function($http,$q,$rootScope){

	var service = {};
	var crudServiceBaseUrl = $rootScope.appConfig.baseUrl;
	var createbankUrl = '/expenditure/create';

	service.getLookupValues = function(id){
		return $http({
            method : 'GET',
            url : crudServiceBaseUrl + '/lookup/getlookup?id='+id
        });
	}

	service.getAudit = function(id){
		return $http({
            method : 'GET',
            url : crudServiceBaseUrl + '/audit/getconfiguration?id=' + id
        });
	}

	service.doSubmitData = function(model){
		return $http({
            method : 'POST',
            url : crudServiceBaseUrl + createbankUrl,
            data : JSON.stringify(model),
		    headers: {
		        "Content-Type": "application/json"
		    }
        });
	}

	service.doUpdateData = function(model){
		return $http({
            method : 'POST',
            url : crudServiceBaseUrl + '/expenditure/update',
            data : JSON.stringify(model),
		    headers: {
		        "Content-Type": "application/json"
		    }
        });
	}	

	return service;

});