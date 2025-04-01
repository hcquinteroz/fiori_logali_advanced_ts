import BaseController from "./BaseController";
import {Route$PatternMatchedEvent} from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Button, { Button$PressEvent } from "sap/m/Button";
import Toolbar from "sap/m/Toolbar";
import Context from "sap/ui/model/odata/v2/Context";
import Utils from "../utils/Utils";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

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
        const reference = this;

        view?.bindElement({
            path: '/Employees('+index+')',
            model: 'northwind',
            events: {
                dataRequest: function() {
                    console.log("Estoy a punto de iniciar el enlace");
                },
                dataReceived: function() {
                    console.log("Ya terminé de enlazar los datos");
                    reference.read();
                }
            }
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
        const utils = new Utils(this);
        
        const object = {
            url: "/IncidentsSet", // Nombre de la entidad. Lo podemos ver en el metadata.xml
            data: {
                SapId: utils.getEmail(),
                // EmployeeId: northwind.getProperty("EmployeeID"),
                EmployeeId: (<number>northwind.getProperty("EmployeeID")).toString(),
                CreationDate: form?.getProperty("CreationDate"),
                Type: form?.getProperty("Type"),
                Reason: form?.getProperty("Reason")
            }
        };

        await utils.crud('create', new JSONModel(object));
        const results = this.read();
        console.log(results);
    }

    private async read(): Promise<void> {
        const utils = new Utils(this);
        const northwind = <Context>this.getView()?.getBindingContext("northwind");
        const employeeId = northwind.getProperty("EmployeeID");

        const object = {
            url: "/IncidentsSet",
            filters: [
                new Filter("SapId", FilterOperator.EQ, utils.getEmail()),
                new Filter("EmployeeId", FilterOperator.EQ, employeeId)
            ]
        };

        const results = await utils.read(new JSONModel(object));
        console.log(results);
    }

    public async onDeleteIncidence(event: Button$PressEvent): Promise<void> {
        
    }
}
