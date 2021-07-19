sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass"
], function (ManagedObject, Fragment, syncStyleClass) {
    "use strict";

    return ManagedObject.extend("demo-crud.controller.HelloDialog", {
        constructor: function (oView) {
            this._oView = oView;
        },

        exit: function () {
            delete this._oView;
        },

        open: function () {
            var oView = this._oView;

            // create dialog lazily
            if (!this.pDialog) {
                var oFragmentController = {
                    onCloseDialog: function () {
                        oView.byId("helloDialog").close();
                    },
                    onClickShowName: function(){
                        alert("Minh Tú đẹp trai nhất quả đất!");
                    }
                };
                // load asynchronous XML fragment
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "demo-crud.view.HelloDialog",
                    controller: oFragmentController
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    // forward compact/cozy style into dialog
					syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
                    return oDialog;
                });
            }

            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });
        }
    });
});