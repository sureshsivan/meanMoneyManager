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
                    {id: 'UPD_REQ', label: 'Request for Update'}];
            }
            return this.getApprovalTypesForUpdate;
        };
		return incexpStatics;
	}
]);
