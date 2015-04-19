'use strict';

angular.module('incexps').service('IncexpStatics', [ '$http', '$q',
	function($http, $q) {
		var incexpStatics = {};


        incexpStatics.getIncexpTypes = function(){
            return this.incexpTypes;
        };
        incexpStatics.loadIncexpTypes = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpTypes.json').then(function(response){
                incexpStatics.incexpTypes = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };

        incexpStatics.getIncexpTags = function(){
            return this.incexpTags;
        };
        incexpStatics.loadIncexpTags = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpTags.json').then(function(response){
                incexpStatics.incexpTags = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };


        incexpStatics.getApprovalTypes = function(){
            return this.approvalTypes;
        };
        incexpStatics.loadApprovalTypes = function(){
            var deferred = $q.defer();
            $http.get('modules/incexps/json/incexpApprovalTypes.json').then(function(response){
                incexpStatics.approvalTypes = response.data;
                deferred.resolve(response.data);
            });
            return deferred.promise;
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

        //incexpStatics.getListIncexpsTemplatePath = function(){
        //    return 'modules/incexps/templates/incexps-list-template.client.html';
        //};
        //
        //incexpStatics.getIncexpType = function(){
        //    if(! this.incexpType){
        //        this.incexpType = [{id: 'INC', label: 'Income'},
        //            //{id: 'UPD_ACC_REQ', label: 'Request for Update Access'},
        //            {id: 'EXP', label: 'Expense'}];
        //    }
        //    return this.incexpType;
        //};
        //incexpStatics.getTagsList = function(){
        //    return $http.get('modules/incexps/json/incexpTags.json');
        //};
        //incexpStatics.getApprovalModel = function(incexp){
        //    if(!incexp){
        //        return {
        //            isPending: false,
        //            pendingType: null,
        //            pendingMsg: ''
        //        };
        //    } else {
        //        return {
        //            isPending: incexp.isPending,
        //            pendingType: incexp.pendingType,
        //            pendingMsg: incexp.pendingMsg
        //        };
        //    }
        //    return $http.get('modules/incexps/json/incexpTags.json');
        //};
		return incexpStatics;
	}
]);
