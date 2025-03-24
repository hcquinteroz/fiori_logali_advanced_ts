import BaseController from "./BaseController";
import {Route$PatternMatchedEvent} from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.acme.employees.controller
 */

export default class Details extends BaseController {

    public onInit(): void {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched.bind(this));
    }

    private onObjectMatched(event: Route$PatternMatchedEvent): void {
        const modelView = <JSONModel>this.getModel("view");
        modelView.setProperty("/layout", "TwoColumnsMidExpanded");

        const args = event.getParameter("arguments") as any;
        const index = args.index;
        const view = this.getView();

        view?.bindElement({
            path: '/Employees/'+index,
            model: 'employees'
        });
    }
}
