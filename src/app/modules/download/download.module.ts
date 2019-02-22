import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgbDropdownModule, NgbTooltipModule, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

import { DownloadComponent } from "./download.component";
import { ManageDownloadComponent } from "./manage-download/manage-download.component";

const routes: Routes = [{
	path: "",
	component: DownloadComponent,
	children: [{
		path: "",
		component: ManageDownloadComponent,
	}, {
		path: "manage",
		component: ManageDownloadComponent,
	}],
}];

@NgModule({
	declarations: [DownloadComponent, ManageDownloadComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbCollapseModule,
		NgbDropdownModule,
		NgbTooltipModule,
	],
})
export class DownloadModule { }
