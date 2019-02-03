import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { ManageHomeComponent } from "./manage-home/manage-home.component";
import { LegendModule } from "../../core/components/legend/legend.module";

const routes: Routes = [{
	path: "", component: ManageHomeComponent,
}];

@NgModule({
	declarations: [ManageHomeComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		LegendModule,
	],
})
export class HomeModule { }
