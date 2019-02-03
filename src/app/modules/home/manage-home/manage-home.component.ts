import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

import { FirebaseService } from "src/app/core/services/firebase.service";

@Component({
	selector: "app-manage-home",
	templateUrl: "./manage-home.component.html",
	styleUrls: ["./manage-home.component.scss"],
})
export class ManageHomeComponent implements OnInit {
	data: Array<Object> = [];
	dataLoaded: Boolean = false;

	constructor(
		private firebase: FirebaseService,
	) { }

	ngOnInit() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);
						this.dataLoaded = true;

						// if (this.$stateParams.id) {
						// 	this.$anchorScroll.yOffset = 55;
						// 	this.$anchorScroll(this.$stateParams.id);
						// }
					});
			}).catch((err) => console.log(err));

			// this.$state.go("login")
	}

	formatData(data: any) {
		data.map((value: any) => {
			if (value.watchStatus <= 1) {
				const filesize = this._convertFilesize(value.filesize);
				let dateFinished: string;

				if (!value.rewatchLast) {
					dateFinished = moment.unix(value.dateFinished).format("MMM DD, YYYY");
				} else {
					dateFinished = moment.unix(value.rewatchLast).format("MMM DD, YYYY");
				}

				// this.titleList.push(value.title);
				this.data.push({
					dateFinished,
					encoder: value.encoder,
					episodes: value.episodes,
					filesize,
					id: value.id,
					ovas: value.ovas,
					quality: value.quality,
					releaseSeason: value.releaseSeason,
					releaseYear: value.releaseYear,
					rewatchCount: value.rewatchCount,
					specials: value.specials,
					title: value.title,
				});
			}
		});

		this.data = this.data.sort(this._compareFunction);
		// angular.copy(this.data, this.pristineData);

		// if (this.search) {
		// 	this.data = new Fuse(this.pristineData, this.fuseOptions).search(this.search);
		// }
	}

	_compareFunction(a: any, b: any) {
		if (a.quality < b.quality) {
			return -1;
		} else if (a.quality > b.quality) {
			return 1;
		}

		if (a.title < b.title) {
			return -1;
		} else if (a.title > b.title) {
			return 1;
		}
	}

	_convertFilesize(filesize: any) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}
}