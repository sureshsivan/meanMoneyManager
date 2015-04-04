'use strict';

angular.module('core').service('IncexpStatics', [ '$http',
	function($http) {
		var incexpStatics = {};
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
		return incexpStatics;
	}
]);