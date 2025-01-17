import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
	fasAngleLeft,
	fasLeaf,
	fasPencilAlt,
	fasSnowflake,
	fasSun,
	fasTrash,
	fasTree,
} from "@rinminase/ng-fortawesome";
import Swal from "sweetalert2";
import { format } from "date-fns";

import { FirebaseService } from "@services/firebase.service";
import { FirebaseQueryBuilder } from "@builders/firebase-query.service";
import { UtilityService } from "@services/utility.service";
import { UpdateHomeComponent } from "../update-home/update-home.component";
import { RewatchComponent } from "./rewatch/rewatch.component";
import { HomeService } from "../home.service";

@Component({
	selector: "app-view-home",
	templateUrl: "./view-home.component.html",
	styleUrls: ["./view-home.component.scss"],
})
export class ViewHomeComponent implements OnInit {
	fasAngleLeft = fasAngleLeft;
	fasLeaf = fasLeaf;
	fasPencil = fasPencilAlt;
	fasSnow = fasSnowflake;
	fasSun = fasSun;
	fasTrash = fasTrash;
	fasTree = fasTree;

	data: any;
	dataLoaded: boolean = false;
	stateId: number;
	homeState: any;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private firebase: FirebaseService,
		private firebaseQueryBuilder: FirebaseQueryBuilder,
		private utility: UtilityService,
		private service: HomeService,
	) {}

	ngOnInit() {
		this.route.params.subscribe((params) => (this.stateId = params["id"]));
		this.service.currentState.subscribe((state) => (this.homeState = state));
		this.fetchData();
	}

	deleteTitle() {
		Swal.fire({
			title: "Are you sure?",
			text: "Your will not be able to recover this entry!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.value) {
				this.service.changeState(this.homeState.search, null);
				this.firebase
					.hardDelete(
						this.firebaseQueryBuilder
							.init()
							.id(this.stateId)
							.build(),
					)
					.then(() => {
						Swal.fire("Deleted", "Entry has been deleted", "success").then(() =>
							this.router.navigateByUrl("/"),
						);
					});
			}
		});
	}

	editTitle() {
		const updateModal = this.modalService.open(UpdateHomeComponent, {
			size: "lg",
			backdrop: "static",
			keyboard: false,
			windowClass: "animate bounceInDown",
		});

		updateModal.componentInstance.data = this.data;
		updateModal.componentInstance.id = this.stateId;

		updateModal.result
			.then(() => {
				this.fetchData();
			})
			.catch(() => {});
	}

	updateRating(rating: any) {
		this.firebase.update(
			this.firebaseQueryBuilder
				.init()
				.id(this.stateId)
				.data({ rating })
				.build(),
		);
		this.data.rating = rating;
	}

	viewRewatch() {
		const rewatchModal = this.modalService.open(RewatchComponent, {
			backdrop: "static",
			keyboard: false,
			windowClass: "animate bounceInDown",
			centered: true,
		});

		const rewatch = this.data.rewatch ? this.data.rewatch.split(",") : [];

		rewatchModal.componentInstance.id = this.stateId;
		rewatchModal.componentInstance.rewatch = rewatch;

		rewatchModal.result
			.then(() => {
				this.fetchData();
			})
			.catch(() => {});
	}

	private fetchData() {
		this.firebase
			.auth()
			.then(() => {
				this.firebase
					.retrieve(
						this.firebaseQueryBuilder
							.init()
							.id(this.stateId)
							.build(),
					)
					.then((data: any) => {
						this.data = this.parseData(data);
						this.dataLoaded = true;
					})
					.catch(() => this.router.navigateByUrl("/"));
			})
			.catch(() => this.router.navigateByUrl("/login"));
	}

	private parseData(data: any) {
		if (data.variants) {
			data.shortTitle = this.parseVariants(data.variants);
		}

		if (data.variants) {
			data.variants = data.variants.split(",");
		}
		if (data.offquel) {
			data.offquel = data.offquel.split(",");
		}

		data.filesizeRaw = data.filesize;
		data.filesize = this.utility.convertFilesize(data.filesize);
		data.dateFinished = format(data.dateFinished * 1000, "MMMM dd, yyyy");

		if (data.duration) {
			data.duration = this.parseDuration(data.duration);
		}

		if (data.rewatch) {
			data.rewatchCount = data.rewatch.split(",").length;
			data.lastRewatch = format(data.rewatchLast * 1000, "MMMM dd, yyyy");
		} else {
			data.rewatchCount = 0;
		}

		switch (data.quality) {
			case "4K 2160p":
				data.qualityClass = "uhd";
				break;
			case "FHD 1080p":
				data.qualityClass = "fhd";
				break;
			case "HD 720p":
				data.qualityClass = "hd";
				break;
			case "HQ 480p":
				data.qualityClass = "hq";
				break;
			default:
				data.qualityClass = "lq";
		}

		return data;
	}

	private parseDuration(duration: number) {
		const hours = Math.trunc(duration / 3600)
			.toString()
			.padStart(2, "0");
		const minutes = Math.trunc((duration % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const seconds = Math.trunc((duration % 3600) % 60)
			.toString()
			.padStart(2, "0");

		return { hours, minutes, seconds };
	}

	private parseVariants(variants: string) {
		return variants.split(",").sort((a: any, b: any) => a.length - b.length)[0];
	}
}
