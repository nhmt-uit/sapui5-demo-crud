sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
	"sap/m/ButtonType",
    "sap/m/MessageToast",
    "sap/m/Text",
], function (Controller, JSONModel, Filter, FilterOperator, Fragment, Dialog, DialogType, Button, ButtonType, MessageToast, Text) {
    "use strict";

    // var dataStudents = {
    //     "Students": [{
    //             "studentID": 1,
    //             "firstName": "Tu",
    //             "lastName": "Nguyen",
    //             "age": 20,
    //             "sex": "M",
    //             "major": "Information Technology"
    //         },
    //         {
    //             "studentID": 2,
    //             "firstName": "Quynh",
    //             "lastName": "Tran",
    //             "age": 22,
    //             "sex": "F",
    //             "major": "Marketing"
    //         },
    //         {
    //             "studentID": 3,
    //             "firstName": "Thao",
    //             "lastName": "Huynh",
    //             "age": 21,
    //             "sex": "F",
    //             "major": "International Relationship"
    //         }
    //     ]
    // }

    return Controller.extend("demo-crud.controller.StudentList", {
        onInit: function () {
            // var oModel = new sap.ui.model.json.JSONModel();
            // this.getView().setModel(oModel, "studentModel");
            // oModel.setData(dataStudents);
            jQuery.ajax({
                type: "POST",
                url: "http://localhost:5005/api/getAllStudents",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": 'true',
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                dataType: "json",
                data: {},
                async: false,
                success: (response, status) => {
                    var oModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oModel, "studentModel");
                    oModel.setData(response);
                }
            });

            // Subcribe function to call another controller.
            sap.ui.getCore().getEventBus().subscribe(
                "StudentList",
                "reloadStudentList",
                this.reloadStudentList,
                this
            );
        },

        onFilterStudent: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            // get Data to filter
            jQuery.ajax({
                type: "POST",
                url: "http://localhost:5005/api/getAllStudents",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": 'true',
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                dataType: "json",
                data: {},
                async: false,
                success: (response, status) => {
                    response.students = response.students.filter((student) => {
                        return student.firstName.indexOf(sQuery) > -1 || student.lastName.indexOf(sQuery) > -1
                    });

                    var oModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oModel, "studentModel");
                    oModel.setData(response);
                }
            });
        },

        reloadStudentList: function () {
            console.log("Đã vào đây...Reload :)")
            jQuery.ajax({
                type: "POST",
                url: "http://localhost:5005/api/getAllStudents",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": 'true',
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                },
                dataType: "json",
                data: {},
                async: false,
                success: (response, status) => {
                    var oModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oModel, "studentModel");
                    oModel.setData(response);
                }
            });
        },

        deleteStudent: function(oEvent) {
            let oSelectedItem = oEvent.getSource().getBindingContext('studentModel').getObject();
            if (!this.oApproveDialog) {
                console.log(oSelectedItem);
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: new Text({ text: "Are you sure you want to delete this student ?" }),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Confirm",
						press: function () {
                            jQuery.ajax({
                                type: "POST",
                                url: "http://localhost:5005/api/deleteStudent",
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Credentials": 'true',
                                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                                },
                                dataType: "json",
                                data: oSelectedItem,
                                async: false,
                                success: (response, status) => {
                                    var oModel = new sap.ui.model.json.JSONModel();
                                    this.getView().setModel(oModel, "studentModel");
                                    oModel.setData(response);
                                }
                            });
							MessageToast.show("Delete successful!");
							this.oApproveDialog.close();
                            this.oApproveDialog = null;
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
                            this.oApproveDialog = null;
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
        },

        editStudent: function(oEvent) {
            let oSelectedItem = oEvent.getSource().getBindingContext('studentModel').getObject();
            let oDataNewStudent = {
				info: oSelectedItem
			};
			var oModel = new JSONModel(oDataNewStudent);
			this.getView().setModel(oModel);

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