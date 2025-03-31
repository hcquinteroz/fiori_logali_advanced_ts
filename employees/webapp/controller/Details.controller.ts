import BaseController from "./BaseController";
import {Route$PatternMatchedEvent} from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Toolbar from "sap/m/Toolbar";
import Context from "sap/ui/model/odata/v2/Context";

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

    public async onSaveIncidence(event: Button$PressEvent): Promise<void> {
        const button = <Button>event.getSource();
        const toolBar = <Toolbar>button.getParent();
        const panel = <Panel>toolBar.getParent();
        const form = panel.getBindingContext("form");
        const northwind = <Context>this.getView()?.getBindingContext("northwind");
        
        const object = {
            url: "IncidentsSet", // Nombre de la entidad. Lo podemos ver en el metadata.xml
            data: {
                SapId: "",
                EmployeeId: northwind.getProperty("EmployeeID"),
                CreationDate: form?.getProperty("CreationDate"),
                Type: form?.getProperty("Type"),
                Reason: form?.getProperty("Reason")
            }
        };

        console.log(object);
    }

    public async onDeleteIncidence(event: Button$PressEvent): Promise<void> {
        
    }
}
