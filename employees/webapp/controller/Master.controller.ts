import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import { FilterBar$SearchEvent, FilterBar$ClearEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import Input from "sap/m/Input";
import ComboBox from "sap/m/ComboBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace com.acme.employees.controller
 */
export default class Master extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        this.loadEmployees();
        this.loadCountries();
    }

    // Load employees Model on the view
    private loadEmployees(): void {
        const model = new JSONModel();
        model.loadData("../model/Employees.json");
        this.setModel(model, "employees");
    }

    // Load countries model on the view
    private loadCountries(): void {
        const model = new JSONModel();
        model.loadData("../model/Countries.json");
        this.setModel(model, "countries");
    }

    // Filter bar manage
    public onFilterBarSearch(event: FilterBar$SearchEvent): void {
        const controls = <Control[]>(event.getParameter("selectionSet"));
        const input = <Input>controls[0];
        const comboBox = <ComboBox>controls[1];

        const sEmployee = input.getValue(); // We get the value of the Employee filter
        const sCountry = comboBox.getSelectedKey(); // We get the id of the country filter

        const filters = [];

        // Employee filter
        if (sEmployee) {
            filters.push(new Filter({
                filters: [
                    new Filter("EmployeeID", FilterOperator.EQ, sEmployee),
                    new Filter({
                        filters: [
                            new Filter("FirstName", FilterOperator.Contains, sEmployee),
                            new Filter("LastName", FilterOperator.Contains, sEmployee)
                        ],
                        and: false
                    })
                ],
                and: false
            }));
        }

        // Country filter
        if (sCountry) {
            filters.push(new Filter("Country", FilterOperator.EQ, sCountry));
        }

        const table = <Table>this.byId("table");
        const binding = <ListBinding>table.getBinding("items");
        binding.filter(filters);
    }

    // Clear filters
    public onFilterBarClear(event: FilterBar$ClearEvent): void {
        const controls = <Control[]>(event.getParameter("selectionSet"));
        const input = <Input>controls[0];
        const comboBox = <ComboBox>controls[1];

        // Clear filters
        input.setValue("");
        comboBox.setSelectedKey("");

        // Execute search again
        this.onFilterBarSearch(event);
    }
}