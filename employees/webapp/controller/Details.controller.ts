import BaseController from "./BaseController";
import {Route$PatternMatchedEvent} from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.acme.employees.controller
 */

export default class Details extends BaseController {

    panel: Panel;

    public onInit(): void {
        const router = this.getRouter();
        router.getRoute("RouteDetails")?.attachPatternMatched(this.onObjectMatched.bind(this));
    }

    // Model
    private formModel(): void {
        const model = new JSONModel([]);
        this.setModel(model, "form");
    }

    private onObjectMatched(event: Route$PatternMatchedEvent): void {

        // Reset content from details
        this.removeAllContent();

        this.formModel();

        const modelView = <JSONModel>this.getModel("view");
        modelView.setProperty("/layout", "TwoColumnsMidExpanded");

        const args = event.getParameter("arguments") as any;
        const index = args.index;
        const view = this.getView();

        view?.bindElement({
            path: '/Employees('+index+')',
            model: 'northwind'
        });
    }

    public onClosePress(): void {
        const router = this.getRouter();
        const viewModel = <JSONModel>this.getModel("view");
        viewModel.setProperty("/layout", "OneColumn");
        router.navTo("RouteMaster");
    }

    private removeAllContent(): void {
        const panel = <Panel>this.byId("tableIncidence");
        panel.removeAllContent();
    }

    public async onCreatePress(): Promise<void> {
        const panel = <Panel>this.byId("tableIncidence");

        const formModel = <JSONModel>this.getModel("form");
        const data = formModel.getData();
        const index = data.length;
        data.push({Index: index + 1});
        formModel.refresh();

        this.panel = await <Promise<Panel>> this.loadFragment({
            name: "com.acme.employees.fragment.NewIncidence"
        });

        this.panel.bindElement({
            path: 'form>/'+index,
            model: 'form'
        });

        panel.addContent(this.panel);
    }
}
