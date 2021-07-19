sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
], function (Controller, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("demo-crud.controller.ControlStudentPanel", {
        onInit: function() {
            var oDataNewStudent = {
				info: {
					"studentID": "",
                    "firstName": "",
                    "lastName": "",
                    "age": "",
                    "sex": "",
                    "major": ""
				}
			};
			var oModel = new JSONModel(oDataNewStudent);
			this.getView().setModel(oModel);
		},

		handleOpenCreateStudentDialog : function () {
			var oView = this.getView();

			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "demo-crud.view.UpsertStudentDialog",
                    controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		},

        onCloseStudentDialog : function () {
			this.byId("upsertStudentDialog").close();
		},

        onCreateStudent: function(oEvent) {
            var infoStudent = this.getView().getModel().oData.info;
			jQuery.ajax({
                type: "POST",
                url: "http://localhost:5005/api/createStudent",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": 'true',
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                dataType: "json",
                data: infoStudent,
                async: false,
                success: (response, status) => {
					console.log(response, status);
                    // Publish function was subcribed
                    sap.ui.getCore().getEventBus().publish(
                        "StudentList",
                        "reloadStudentList",
                        this.reloadStudentList
                    );
                    MessageToast.show(response.message)
                }
            });
            this.byId("upsertStudentDialog").close();
        }
    });
});