'use strict';

angular.module('incexps').service('IncexpStatics', [ '$http',
	function($http) {
		var incexpStatics = {};


        incexpStatics.getIncexpTypes = function(){
            return this.incexpTypes;
        };
        incexpStatics.loadIncexpTypes = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpTypes.json').then(function(response){
                incexpStatics.incexpTypes = response;
                deferred.resolve(null);
            });
            return deferred.promise;
        };


		incexpStatics.getListIncexpsTemplatePath = function(){
			return 'modules/incexps/templates/incexps-list-template.client.html';
		};
        incexpStatics.getApprovalTypesForCreation = function(){
				if(! this.approvalTypesForCreation){
					this.approvalTypesForCreation = [{id: 'UPD_REQ', label: 'Request for Update'}];
				}
				return this.approvalTypesForCreation;
			};
        incexpStatics.getApprovalTypesForUpdate = function(){
            if(! this.getApprovalTypesForUpdate){
                this.getApprovalTypesForUpdate = [{id: 'DEL_REQ', label: 'Request for Deletion'},
                    {id: 'UPD_REQ', label: 'Request for Update'},
                    {id: 'UPD_ACC_REQ', label: 'Request for Update Access'},
                    {id: 'UPD_ACC_APP', label: 'Approve Update Access Request'}];
            }
            return this.getApprovalTypesForUpdate;
        };
        incexpStatics.getIncexpType = function(){
            if(! this.incexpType){
                this.incexpType = [{id: 'INC', label: 'Income'},
                    //{id: 'UPD_ACC_REQ', label: 'Request for Update Access'},
                    {id: 'EXP', label: 'Expense'}];
            }
            return this.incexpType;
        };
        incexpStatics.getTagsList = function(){
            return $http.get('modules/incexps/json/incexpTags.json');
        };
        
		return incexpStatics;
	}
]);
