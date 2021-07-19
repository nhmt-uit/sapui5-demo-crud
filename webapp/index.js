sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function(ComponentContainer){
    'use strict';

    new ComponentContainer({
        name: 'demo-crud',
        setting: {
            id: 'demo-crud'
        },
        async: true
    }).placeAt("content");
})