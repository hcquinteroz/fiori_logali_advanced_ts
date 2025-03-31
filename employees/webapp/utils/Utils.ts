import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.acme.employees.utils
 */

export default class Utils {
    private controller: Controller;
    private model: ODataModel;
    private resourceBundle: ResourceBundle;

    constructor(controller: Controller) {
        this.controller = controller;
        this.model = <ODataModel>((<UIComponent>this.controller.getOwnerComponent()).getModel("zincidence"));
        this.resourceBundle = <ResourceBundle>(<ResourceModel>(<UIComponent>this.controller.getOwnerComponent()).getModel("i18n")).getResourceBundle();
    }

    public getEmail(): string {
        return "c24c313@logaligroup.com";
    }
}
