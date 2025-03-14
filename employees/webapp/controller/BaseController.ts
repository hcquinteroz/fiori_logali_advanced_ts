import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.acme.employees
 */

export default class BaseController extends Controller {

    public getRouter(): Router {
        return (<UIComponent>this.getOwnerComponent()).getRouter();
    }

    public getModel(modelName: string): Model {
        return (<Model>this.getView()?.getModel(modelName));
    }

    public setModel(model: Model, modelName: string): View | undefined {
        return this.getView()?.setModel(model, modelName);
    }

    public getResourceBundle(): ResourceBundle {
        return <ResourceBundle>(<ResourceModel>(<UIComponent>this.getOwnerComponent())?.getModel("i18n"))?.getResourceBundle();
    }

}