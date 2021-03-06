app.controller('GrievanceReportController',['$http','$window','$scope','$rootScope','notify','$location','$state','storage','grievancereportfactory','$q',
	function($http,$window,$scope,$rootScope,notify,$location,$state,storage,grievancereportfactory,$q){
		
		$scope.crudServiceBaseUrl = $rootScope.appConfig.baseUrl;
		$scope.defaultSearchReq = {
		  "referenceId": null,
		  "roundId": null,
		  "districtId": null,
		  "blockId": null,
		  "villageId": null
		};

		$scope.reportTitle = "Grievances Report";

		$scope.searchReq =  angular.copy($scope.defaultSearchReq);


		$scope.selectedFy = [];
		$scope.selectedRounds = [];
		$scope.selectedDistricts = [];
		$scope.selectedBlocks = [];
		$scope.selectedVps = []; 
		$scope.selectedusers = [];
		$scope.selectedIsConsolidateRpt = false;
		
		$scope.$watch('selectedIsConsolidateRpt', function(newValue,oldValue){
			$scope.stateChanged(newValue);	
		});
		
        $scope.selectFyOptions = {
            placeholder: "Select Year...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            dataSource: {
                transport:{
	                read: function (e) {
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.FinancialYear
				      }).success(function(data, status, headers, config) {
	                  	data&&e.success(data)
	                  });	                	
	              }
	            }
            },
            change: function(){
            	$scope.multiSelectddlRounds.options.initialLoad = false;
            	$scope.multiSelectddlRounds.dataSource.read();
            }
        };

        $scope.selectRoundOptions = {
            placeholder: "Select Round...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            initialLoad : true,
            dataSource: {
                transport:{
	                read: function (e) {
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.Rounds+((($scope.selectedFy)?"&where="+$scope.selectedFy.join(','):''))
				      }).success(function(data, status, headers, config) {
				      	if(!$scope.multiSelectddlRounds.options.initialLoad)
	                  		data&&e.success(data);
	                  	else
	                  		e.success([]);
	                  });	                	
	              }
	            }
            },
            change: function(){
            	$scope.selectedIsConsolidateRpt &&($scope.stateChanged($scope.selectedIsConsolidateRpt));
            }
        };

        $scope.selectDistrictOptions = {
            placeholder: "Select District...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            dataSource: {
                transport:{
	                read: function (e) {
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.Districts
				      }).success(function(data, status, headers, config) {
						if( $rootScope.sessionConfig.isDistrictLevelPerson){
							var v = $.map(data,function(key,obj){
								if(($rootScope.sessionConfig.allottedDistrict === key.value))
									return  key;
							});
							(v.length>0)&&(data = v);
						}
						data&&e.success(data);
	                  });	                	
	              }
	            }
            },
            change: function(){
            	$scope.multiSelectddlBlocks.options.initialLoad = false;
            	$scope.multiSelectddlUsers.options.initialLoad = false;
            	$scope.multiSelectddlBlocks.dataSource.read();
            	$scope.multiSelectddlUsers.dataSource.read();
            }
        };    

        $scope.selectBlocksOptions = {
            placeholder: "Select Block...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            initialLoad : true,
            dataSource: {
                transport:{
	                read: function (e) {
	                	var temp = '';
	                	$scope.selectedDistricts&&(temp=$scope.selectedDistricts.join(','));
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.Blocks+'&where='+temp
				      }).success(function(data, status, headers, config) {
				      	if(!$scope.multiSelectddlBlocks.options.initialLoad)
	                  		data&&e.success(data);
	                  	else
	                  		e.success([]);
	                  });	                	
	              }
	            }
            },
            change: function(){
            	$scope.multiSelectddlVps.options.initialLoad = false;
            	$scope.multiSelectddlVps.dataSource.read();
            }
        };

        $scope.selectPanchayatsOptions = {
            placeholder: "Select Panchayat...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            initialLoad : true,
            dataSource: {
                transport:{
	                read: function (e) {
	                	var temp = '';
	                	$scope.selectedBlocks&&(temp=$scope.selectedBlocks.join(','));
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.VillagePanchayats+'&where='+temp
				      }).success(function(data, status, headers, config) {
				      	if(!$scope.multiSelectddlVps.options.initialLoad)
	                  		data&&e.success(data);
	                  	else
	                  		e.success([]);
	                  });	                	
	              }
	            }
            },
            change: function(){
            	//$scope.multiSelectddlFy.dataSource.read();
            }
        };

        $scope.selectUsersOptions = {
            placeholder: "Select User...",
            dataTextField: "text",
            dataValueField: "value",
            valuePrimitive: true,
            autoClose : false,
		    tagMode: "single",
            initialLoad : true,
            dataSource: {
                transport:{
	                read: function (e) {
	                	var temp = '';
	                	$scope.selectedDistricts&&(temp=$scope.selectedDistricts.join(','));
	                  $http({
				         method: 'GET',
				         url: $scope.crudServiceBaseUrl + '/lookup/getlookup?id='+$rootScope.appConfig.lookupTypes.Users+'&where='+temp
				      }).success(function(data, status, headers, config) {
				      	if(!$scope.multiSelectddlUsers.options.initialLoad)
	                  		data&&e.success(data);
	                  	else
	                  		e.success([]);
	                  });	                	
	              }
	            }
            },
            change: function(){
            	//$scope.multiSelectddlFy.dataSource.read();
            }
        };

		$scope.stateChanged = function(state){
			$scope.grid.showColumn('roundName');
			$scope.grid.showColumn('blockName');
			$scope.grid.showColumn('vpName');			
			if(state){
				$scope.grid.hideColumn('roundName');
				$scope.grid.hideColumn('blockName');
				$scope.grid.hideColumn('vpName');
			}
		}

		$scope.OnReset = function(){
			$scope.selectedFy = [];
			$scope.selectedRounds = [];
			$scope.selectedDistricts = [];
			$scope.selectedBlocks = [];
			$scope.selectedVps = [];
			$scope.selectedusers = [];
			$scope.searchReq =  angular.copy($scope.defaultSearchReq);		
			$scope.selectedIsConsolidateRpt = false;
		}

		$scope.doSearch = function(){
			$scope.searchReq = {
			  "referenceId": (($scope.selectedFy)?$scope.selectedFy.join(','):null),
			  "roundId": (($scope.selectedRounds)?$scope.selectedRounds.join(','):null),
			  "districtId": (($scope.selectedDistricts)?$scope.selectedDistricts.join(','):null),
			  "blockId": (($scope.selectedBlocks)?$scope.selectedBlocks.join(','):null),
			  "villageId": (($scope.selectedVps)?$scope.selectedVps.join(','):null),
			  "isConsolidate": $scope.selectedIsConsolidateRpt,
			  "userId":  (($scope.selectedusers)?$scope.selectedusers.join(','):null),				  
			};
			$scope.grid.dataSource.read();
			$scope.grid.dataSource.page(1);
		}

	    $scope.gridOptions = {
			toolbar: ["excel"],
			excel: {
                fileName: "grievances"+new Date().getTime()+".xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true,
                allPages: true
            },	    	
	        columns: [ 
		        		{ field: "id", title:'Audit ID', menu:false, hidden: true, editable : false },
		        		{ field: "financialYear", locked: true, groupable:true,width: '80px', title:'FY', footerTemplate: "Total :"},
		        		{ field: "roundName", locked: true, groupable:true,width: '90px', title:'Round'},
		        		{ field: "districtName", locked: true, groupable:true,width: '90px', title:'District'},
		        		{ field: "blockName", locked: true, groupable:true,width: '90px', title:'Block'},
		        		{ field: "vpName", locked: true, groupable:true,width: '120px', title:'Panchayat'},
		        		{ field: "totalReceivedGrievancesHF", title:'Grievances received during Household verification', groupable:false,width: '250px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "totalReceivedGrievancesMeeting", title:'Grievances received during GS meeting', groupable:false,width: '140px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "hfTotal",title: 'Total',groupable:false,width: '140px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#"},
		        		{ field: "reqForNewJc", title:'Request for new Job card', groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "reqForMoreThan100Days", title : "Request for work for more than 100 days", groupable:false,width: '200px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "reqForConstructionIHHL", title : "Request for constructions of IHHL", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "reqForConstructionIAYHouse", title : "Request for construction of IAY house", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "reqForConstructionCattleShelter", title : "Request for the construction of cattle shelter", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "demandForWork", title : "Demand for MNREGA work", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "demandForRenewelJc", title : "Demand for renewal of job card", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "demandForIndividualBenefitScheme", title : "Demand for individual benefit schemes", groupable:false,width: '180px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "demandForWagesIncrease", title : "Demand for Wage increase", groupable:false,width: '150px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },

		        		{ field: "demandForPds", title : "Demand for PDS", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "demandForLibraryBuilding", title : "Demand for library building", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "nonProvisionOfWorkSiteFacilities", title : "Non provision of work site facilities", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintAgainstBankingCorrespondent", title : "Complaint against Banking correspondent", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "oapnotProvidedJc", title : "OAP not provided job card", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "oapnotProvidedWork", title : "OAP not provided work", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintsAgainstWorksiteFacilidator", title : "Complaints against worksite facilitator", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintsAgainstVPPresident", title : "Complaints against VP president", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintsAgainstUnionOverseer", title : "Complaints against Union Overseer", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintsAgainstBDOVP", title : "Complaint against BDO VP", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "complaintsAgainstVPSecretory", title : "Complaint against VP Secretary", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{ field: "others", title : "Others", groupable:false,width: '130px', aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        		{
		        			title : "Delay in wage payment",
		        			columns :[
		        				{ field: "delayWagesPaymentCount",headerTemplate: "No", title : "Delay in wage payment No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "delayWagesPaymentAmt",format: '{0:n0}', headerTemplate : "Amount", title : "Delay in wage payment Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Full entitlement not given to differently abled",
		        			columns :[
		        				{ field: "fullEntitlementNotGivenCount", headerTemplate : "No", title : "Full entitlement not given to differently abled No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "fullEntitlementNotGivenAmt",format: '{0:n0}', headerTemplate : "Amount", title : "Full entitlement not given to differently abled Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Less than payment value recorded in M-Book",
		        			columns :[
		        				{ field: "lessPaymentValueRecordedMBookCount", headerTemplate : "No", title : "Less than payment value recorded in M-Book No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "lessPaymentValueRecordedMBookAmt",format: '{0:n0}', headerTemplate : "Amount", title : "Less than payment value recorded in M-Book Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Wages drawn for days less than actual no of days worked",
		        			columns :[
		        				{ field: "wagesDrawnLessThanActualNoDaysCount", headerTemplate : "No", title:"Wages drawn for days less than actual no of days worked No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "wagesDrawnLessThanActualNoDaysAmt",format: '{0:n0}', headerTemplate : "Amount", title:"Wages drawn for days less than actual no of days worked Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Wages not paid to workers who actually worked",
		        			columns :[
		        				{ field: "wagesNotPaidWorkersActuallyWorkedCount", headerTemplate : "No",title : "Wages not paid to workers who actually worked No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "wagesNotPaidWorkersActuallyWorkedAmt",format: '{0:n0}', headerTemplate : "Amount",title : "Wages not paid to workers who actually worked Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Transport allowance not given",
		        			columns :[
		        				{ field: "transportAllowanceNotGivenCount", headerTemplate : "No",title : "Transport allowance not given No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "transportAllowanceNotGivenAmt",format: '{0:n0}', headerTemplate : "Amount",title : "Transport allowance not given Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "No compensation for injured at worksite",
		        			columns :[
		        				{ field: "noCompensationInjuredAtWorksiteCount", headerTemplate : "No", title : "No compensation for injured at worksite No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "noCompensationInjuredAtWorksiteAmt",format: '{0:n0}', headerTemplate : "Amount", title : "No compensation for injured at worksite Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "No compensation for death at worksite",
		        			columns :[
		        				{ field: "noCompensationDeadAtWorksiteCount", headerTemplate : "No", title : "No compensation for death at worksite No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "noCompensationDeadAtWorksiteAmt",format: '{0:n0}', headerTemplate : "Amount", title : "No compensation for death at worksite Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "No of requests for payment of completed IHHL work",
		        			columns :[
		        				{ field: "reqPaymentCompletedIHHLWorkCount", headerTemplate : "No",title: "No of requests for payment of completed IHHL work No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "reqPaymentCompletedIHHLWorkAmt",format: '{0:n0}', headerTemplate : "Amount",title: "No of requests for payment of completed IHHL work Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		},
		        		{
		        			title : "Total",
		        			columns :[
		        				{ field: "TotalNo", headerTemplate : "No",title: "Total No",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#" },
		        				{ field: "TotalAmt",format: '{0:n0}', headerTemplate : "Amount",title: "Total Amount",width: '130px', groupable:false, aggregates: ["sum"] ,footerTemplate: "#=kendo.toString(sum,\"n0\")#", groupFooterTemplate: "#=kendo.toString(sum,\"n0\")#" },
		        			]
		        		}
		        	],
	        pageable: true,
	        filterable :true,
	        groupable : true,
	        sortable: true,
	        columnMenu: true,
            reorderable: true,
            resizable: true,
            scrollable: true,	        
	        pageSize: 10,
	        autoBind : false,
            pageable: {
                refresh: true,
                pageSizes: [10, 25, 50, 100, "All"],
                messages: {
					itemsPerPage: "Grievances",
	                display: "{0}-{1} from {2} Grievances",
	                empty: "No data",
	                allPages: "Show All",                	
	                refresh: "Refresh Grievances"
                }
            },	        
	        dataSource: {
	            pageSize: 10,
	            transport: {
	                read: function (e) {
					 if( $rootScope.sessionConfig.isDistrictLevelPerson)
						$scope.searchReq.districtId = $rootScope.sessionConfig.allottedDistrict;	                	
	                  $http({
				         method: 'POST',
				         url: $scope.crudServiceBaseUrl + '/grievances/grievancesreports',
				         data : JSON.stringify($scope.searchReq)			         
				      }).
	                  success(function(data, status, headers, config) {
	                  	if(data.status)
	                      e.success(data.data)
	                  }).
	                  error(function(data, status, headers, config) {
	                  });
	              }
	           },
				schema:{
                    model: {
                        fields: {
                            totalReceivedGrievancesHF: { type: "number" },
                            totalReceivedGrievancesMeeting: { type: "number" },
                            hfTotal: { type: "number" },
                            reqForNewJc: { type: "number" },
                            reqForMoreThan100Days: { type: "number" },
                            reqForConstructionIHHL: { type: "number" },
                            reqForConstructionIAYHouse: { type: "number" },
                            reqForConstructionCattleShelter: { type: "number" },
                            demandForWork: { type: "number" },
                            demandForRenewelJc: { type: "number" },
                            demandForIndividualBenefitScheme: { type: "number" },
                            demandForWagesIncrease: { type: "number" },
                            demandForPds: { type: "number" },
                            demandForLibraryBuilding: { type: "number" },
                            nonProvisionOfWorkSiteFacilities: { type: "number" },
                            complaintAgainstBankingCorrespondent: { type: "number" },
                            oapnotProvidedJc: { type: "number" },
                            oapnotProvidedWork: { type: "number" },
                            complaintsAgainstVPPresident: { type: "number" },
                            complaintsAgainstUnionOverseer: { type: "number" },
                            complaintsAgainstBDOVP: { type: "number" },
                            complaintsAgainstWorksiteFacilidator: { type: "number" },
                            complaintsAgainstVPSecretory: { type: "number" },
                            others: { type: "number" },
                            delayWagesPaymentCount: { type: "number" },
                            delayWagesPaymentAmt: { type: "number" },
                            fullEntitlementNotGivenCount: { type: "number" },
                            fullEntitlementNotGivenAmt: { type: "number" },
                            lessPaymentValueRecordedMBookCount: { type: "number" },
                            lessPaymentValueRecordedMBookAmt: { type: "number" },
                            wagesDrawnLessThanActualNoDaysCount: { type: "number" },
                            wagesDrawnLessThanActualNoDaysAmt: { type: "number" },
                            wagesNotPaidWorkersActuallyWorkedCount: { type: "number" },
                            wagesNotPaidWorkersActuallyWorkedAmt: { type: "number" },
                            transportAllowanceNotGivenCount: { type: "number" },
                            transportAllowanceNotGivenAmt: { type: "number" },
                            noCompensationInjuredAtWorksiteCount: { type: "number" },
                            noCompensationInjuredAtWorksiteAmt: { type: "number" },
                            noCompensationDeadAtWorksiteCount: { type: "number" },
                            noCompensationDeadAtWorksiteAmt: { type: "number" },
                            reqPaymentCompletedIHHLWorkCount: { type: "number" },
                            reqPaymentCompletedIHHLWorkAmt: { type: "number" },
                            TotalNo: { type: "number" },
                            TotalAmt: { type: "number" }  
                        }
                    },
				    parse : function (d) {
				        $.each(d, function(idx, elem) {
				            elem.hfTotal = (elem.totalReceivedGrievancesHF || 0) + (elem.totalReceivedGrievancesMeeting||0);
				            elem.TotalNo =  ( elem.reqForNewJc || 0) + 
											( elem.reqForMoreThan100Days || 0) + 
											( elem.reqForConstructionIHHL || 0) + 
											( elem.reqForConstructionIAYHouse || 0) + 
											( elem.reqForConstructionCattleShelter || 0) + 
											( elem.demandForWork || 0) + 
											( elem.demandForRenewelJc || 0) + 
											( elem.demandForIndividualBenefitScheme || 0) + 
											( elem.demandForWagesIncrease || 0) + 
											( elem.demandForPds || 0) + 
											( elem.demandForLibraryBuilding || 0) + 
											( elem.nonProvisionOfWorkSiteFacilities || 0) + 
											( elem.complaintAgainstBankingCorrespondent || 0) + 
											( elem.oapnotProvidedJc || 0) + 
											( elem.oapnotProvidedWork || 0) + 
											( elem.complaintsAgainstVPPresident || 0) + 
											( elem.complaintsAgainstUnionOverseer || 0) + 
											( elem.complaintsAgainstBDOVP || 0) + 
											( elem.complaintsAgainstWorksiteFacilidator || 0) + 
											( elem.complaintsAgainstVPSecretory || 0) + 
											( elem.others || 0) + 
											(elem.delayWagesPaymentCount || 0) + 
											(elem.fullEntitlementNotGivenCount||0)+
											(elem.lessPaymentValueRecordedMBookCount||0)+
											(elem.wagesDrawnLessThanActualNoDaysCount||0)+
											(elem.wagesNotPaidWorkersActuallyWorkedCount||0)+
											(elem.transportAllowanceNotGivenCount||0)+
											(elem.noCompensationInjuredAtWorksiteCount||0)+
											(elem.noCompensationDeadAtWorksiteCount||0)+
											(elem.reqPaymentCompletedIHHLWorkCount||0);
				            elem.TotalAmt = (elem.delayWagesPaymentAmt || 0) + 
				            				(elem.fullEntitlementNotGivenAmt||0)+
				            				(elem.lessPaymentValueRecordedMBookAmt||0)+
				            				(elem.wagesDrawnLessThanActualNoDaysAmt||0)+
				            				(elem.wagesNotPaidWorkersActuallyWorkedAmt||0)+
				            				(elem.transportAllowanceNotGivenAmt||0)+
				            				(elem.noCompensationInjuredAtWorksiteAmt||0)+
				            				(elem.noCompensationDeadAtWorksiteAmt||0)+
				            				(elem.reqPaymentCompletedIHHLWorkAmt||0);
				        });
				        return d;
				    }
                },
                group:{
                	field :"roundName",aggregates: [
		                { field: "totalReceivedGrievancesHF", aggregate: "sum" },
						{ field: "totalReceivedGrievancesMeeting", aggregate: "sum"},
						{ field: "hfTotal", aggregate: "sum"},
		        		{ field: "reqForNewJc", aggregate: "sum"},
		        		{ field: "reqForMoreThan100Days", aggregate: "sum"},
		        		{ field: "reqForConstructionIHHL", aggregate: "sum"},
		        		{ field: "reqForConstructionIAYHouse", aggregate: "sum"},
		        		{ field: "reqForConstructionCattleShelter", aggregate: "sum"},
		        		{ field: "demandForWork", aggregate: "sum"},
		        		{ field: "demandForRenewelJc", aggregate: "sum"},
		        		{ field: "demandForIndividualBenefitScheme", aggregate: "sum"},
		        		{ field: "demandForWagesIncrease", aggregate: "sum"},
		        		{ field: "demandForPds", aggregate: "sum"},
		        		{ field: "demandForLibraryBuilding", aggregate: "sum"},
		        		{ field: "nonProvisionOfWorkSiteFacilities", aggregate: "sum"},
		        		{ field: "complaintAgainstBankingCorrespondent", aggregate: "sum"},
		        		{ field: "oapnotProvidedJc", aggregate: "sum"},
		        		{ field: "oapnotProvidedWork", aggregate: "sum"},
		        		{ field: "complaintsAgainstVPPresident", aggregate: "sum"},
		        		{ field: "complaintsAgainstUnionOverseer", aggregate: "sum"},
		        		{ field: "complaintsAgainstBDOVP", aggregate: "sum"},
		        		{ field: "complaintsAgainstWorksiteFacilidator", aggregate: "sum"},
		        		{ field: "complaintsAgainstVPSecretory", aggregate: "sum"},
		        		{ field: "others", aggregate: "sum"},
		        		{ field: "delayWagesPaymentCount", aggregate: "sum"},
		        		{ field: "delayWagesPaymentAmt", aggregate: "sum"},
		        		{ field: "fullEntitlementNotGivenCount", aggregate: "sum"},
		        		{ field: "fullEntitlementNotGivenAmt", aggregate: "sum"},
		        		{ field: "lessPaymentValueRecordedMBookCount", aggregate: "sum"},
		        		{ field: "lessPaymentValueRecordedMBookAmt", aggregate: "sum"},
		        		{ field: "wagesDrawnLessThanActualNoDaysCount", aggregate: "sum"},
		        		{ field: "wagesDrawnLessThanActualNoDaysAmt", aggregate: "sum"},
		        		{ field: "wagesNotPaidWorkersActuallyWorkedCount", aggregate: "sum"},
		        		{ field: "wagesNotPaidWorkersActuallyWorkedAmt", aggregate: "sum"},
		        		{ field: "transportAllowanceNotGivenCount", aggregate: "sum"},
		        		{ field: "transportAllowanceNotGivenAmt", aggregate: "sum"},
		        		{ field: "noCompensationInjuredAtWorksiteCount", aggregate: "sum"},
		        		{ field: "noCompensationInjuredAtWorksiteAmt", aggregate: "sum"},
		        		{ field: "noCompensationDeadAtWorksiteCount", aggregate: "sum"},
		        		{ field: "noCompensationDeadAtWorksiteAmt", aggregate: "sum"},
		        		{ field: "reqPaymentCompletedIHHLWorkCount", aggregate: "sum"},
		        		{ field: "reqPaymentCompletedIHHLWorkAmt", aggregate: "sum"},
		        		{ field: "TotalNo", aggregate: "sum"},
		        		{ field: "TotalAmt", aggregate: "sum"} 
                    ]
                },
	            aggregate: [
	                { field: "totalReceivedGrievancesHF", aggregate: "sum" },
					{ field: "totalReceivedGrievancesMeeting", aggregate: "sum"},
					{ field: "hfTotal", aggregate: "sum"},
	        		{ field: "reqForNewJc", aggregate: "sum"},
	        		{ field: "reqForMoreThan100Days", aggregate: "sum"},
	        		{ field: "reqForConstructionIHHL", aggregate: "sum"},
	        		{ field: "reqForConstructionIAYHouse", aggregate: "sum"},
	        		{ field: "reqForConstructionCattleShelter", aggregate: "sum"},
	        		{ field: "demandForWork", aggregate: "sum"},
	        		{ field: "demandForRenewelJc", aggregate: "sum"},
	        		{ field: "demandForIndividualBenefitScheme", aggregate: "sum"},
	        		{ field: "demandForWagesIncrease", aggregate: "sum"},
	        		{ field: "demandForPds", aggregate: "sum"},
	        		{ field: "demandForLibraryBuilding", aggregate: "sum"},
	        		{ field: "nonProvisionOfWorkSiteFacilities", aggregate: "sum"},
	        		{ field: "complaintAgainstBankingCorrespondent", aggregate: "sum"},
	        		{ field: "oapnotProvidedJc", aggregate: "sum"},
	        		{ field: "oapnotProvidedWork", aggregate: "sum"},
	        		{ field: "complaintsAgainstVPPresident", aggregate: "sum"},
	        		{ field: "complaintsAgainstUnionOverseer", aggregate: "sum"},
	        		{ field: "complaintsAgainstBDOVP", aggregate: "sum"},
	        		{ field: "complaintsAgainstWorksiteFacilidator", aggregate: "sum"},
	        		{ field: "complaintsAgainstVPSecretory", aggregate: "sum"},
	        		{ field: "others", aggregate: "sum"},
	        		{ field: "delayWagesPaymentCount", aggregate: "sum"},
	        		{ field: "delayWagesPaymentAmt", aggregate: "sum"},
	        		{ field: "fullEntitlementNotGivenCount", aggregate: "sum"},
	        		{ field: "fullEntitlementNotGivenAmt", aggregate: "sum"},
	        		{ field: "lessPaymentValueRecordedMBookCount", aggregate: "sum"},
	        		{ field: "lessPaymentValueRecordedMBookAmt", aggregate: "sum"},
	        		{ field: "wagesDrawnLessThanActualNoDaysCount", aggregate: "sum"},
	        		{ field: "wagesDrawnLessThanActualNoDaysAmt", aggregate: "sum"},
	        		{ field: "wagesNotPaidWorkersActuallyWorkedCount", aggregate: "sum"},
	        		{ field: "wagesNotPaidWorkersActuallyWorkedAmt", aggregate: "sum"},
	        		{ field: "transportAllowanceNotGivenCount", aggregate: "sum"},
	        		{ field: "transportAllowanceNotGivenAmt", aggregate: "sum"},
	        		{ field: "noCompensationInjuredAtWorksiteCount", aggregate: "sum"},
	        		{ field: "noCompensationInjuredAtWorksiteAmt", aggregate: "sum"},
	        		{ field: "noCompensationDeadAtWorksiteCount", aggregate: "sum"},
	        		{ field: "noCompensationDeadAtWorksiteAmt", aggregate: "sum"},
	        		{ field: "reqPaymentCompletedIHHLWorkCount", aggregate: "sum"},
	        		{ field: "reqPaymentCompletedIHHLWorkAmt", aggregate: "sum"},
	        		{ field: "TotalNo", aggregate: "sum"},
	        		{ field: "TotalAmt", aggregate: "sum"}  
	            ]	           
	        }
	    }
}]);

app.factory("grievancereportfactory",function($http,$q,$rootScope){

	var service = {};
	var crudServiceBaseUrl = $rootScope.appConfig.baseUrl;

	service.getLookupValues = function(id,w){
		w = w || '';
		return $http({
            method : 'GET',
            url : crudServiceBaseUrl + '/lookup/getlookup?id='+id + '&where=' + (w ? w : '')
        });
	}
	return service;
});