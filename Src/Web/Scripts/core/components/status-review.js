import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";

Vue.component("status-review", {
    props: {
    },
    data() {
        return {
            services: {
                consumptionUrl: "/UDPrint/GetConsumptionByTrackingNo?trackingNo=",
                updateReviewUrl: "/api/reviews",
                countryUrl: "/api/reviews/country",
                uploadedDocs: "/api/reviews/UploadedDocuments?trackingNo=",
                reviewHistoriesUrl: "/api/reviews/histories?trackingNo=",
                searchUrl: "/api/reviews?",
                supportiveDocumentUrl: "/SupportiveDocument/GetSupportiveDocuments",
                factoriesUrl: "/api/reviews/factory",
                foctoryTypesUrl: "/api/reviews/factoryType",
                reviewStatusUrl: "/api/reviews/review-status",
                udSessionSetUrl: "/Ud/SetSelectedUD?udTrackingNo=",
                primaryScrutineerSearchUrl: "/api/reviews/PrimaryScrutineers",
                secondaryScrutineerSearchUrl: "/api/reviews/SecondaryScrutineers",
                docs: "/api/reviews/UploadedDocuments?trackingNo="
            },
            args: {
                paymentType: "2",
                dateRange: "0",
                fromDate: "",
                toDate: "",
                trackingNo: "",
                reviewStatusId: "",
                pageSize: "10",
                pageNumber: "1",
                flagged: "",
                factoryName: "",
                factoryTypeId: "",
                applicationType: "",
                source: "UD",
                ExportLcNo: "",
                ImportLcNo: "",
                CountryCode: "",
                UsedQty: "",
                Qty: "",
                QtyComparerOperator: "0"

            },
            uds: [],
            pagination: {},
            supportiveDocuments: Array,
            factories: Array,
            factoryTypes: Array,
            reviewStatus: Array,
            reviewHitories: Array,
            annexThree: {},
            primaryScrutineers: [],
            secondaryScrutineers: [],
            countries: []
        };
    },

    mounted() {
        const vm = this;

        axios.get(vm.services.factoriesUrl).then(response => {
            vm.factories = response.data;
        });

        axios.get(vm.services.countryUrl).then(response => {
            vm.countries = response.data;
        });

        axios.get(vm.services.foctoryTypesUrl).then(response => {
            vm.factoryTypes = response.data;
        });

        axios.get(vm.services.reviewStatusUrl).then(response => {
            vm.reviewStatus = response.data;
        });

        vm.search();

        vm.$root.$on("bv::collapse::state", (data, isJustShown) => {
            if (isJustShown) {
                if (data.endsWith("doc")) {
                    axios.get(this.services.docs + data.split("doc")[0]).then(response => {
                        let ud = vm.uds.find(u => u.ReferenceId === data.split("doc")[0]);
                        Vue.set(ud, 'SupportiveDocs', response.data);
                    });
                }
                else if (data) {
                    vm.fetchReviewHitories(data);
                }
            }
        });
    },

    methods: {
        getSupporiveDocs(review) {
            axios.get(this.services.docs + review.ReferenceId).then(response => {
                Vue.set(review, 'SupportiveDocs', response.data);
            });
        },

        clear() {
            this.args = {
                paymentType: "2",
                dateRange: "0",
                fromDate: "",
                toDate: "",
                trackingNo: "",
                reviewStatusId: "",
                pageSize: "10",
                pageNumber: "1",
                flagged: "",
                factoryName: "",
                factoryTypeId: "",
                applicationType: "",
                source: "UD",
                ExportLcNo: "",
                ImportLcNo: "",
                CountryCode: "",
                UsedQty: "",
                Qty: "",
                QtyComparerOperator: "0"
            };
        },

        fetchReviewHitories(trackingNo) {
            const vm = this;
            axios.get(vm.services.reviewHistoriesUrl + trackingNo)
                .then(response => {
                    let data = response.data;
                    data.forEach((r) => {
                        r.EntryDate = format(new Date(r.EntryDate), "dd-MM-yy hh:MM:ss");
                    });
                    vm.reviewHitories = data;
                });
        },

        fetchConsumptions(trackingNo) {
            const vm = this;
            axios.get(vm.services.consumptionUrl + trackingNo)
                .then(response => {
                    vm.annexThree = response.data;
                });
        },

        fetchUploadedDocs(ud) {
            const vm = this;
            axios.get(vm.services.uploadedDocs + ud.ReferenceId)
                .then(response => {
                    vm.uploadedDocs = response.data;
                });

            ud.SupportiveDocs.forEach((d) => {
                if (vm.uploadedDocs) {
                    let u = vm.uploadedDocs.find(f => f.DocumentTypeId === d.Id);
                    if (u) {
                        Vue.set(d, "FilePath", u.FilePath);
                    }
                }
            });
        },


        search() {

            let defaultUrl = this.services.searchUrl
                + "DateRange=" + this.args.dateRange
                + "&TrackingNo=" + this.args.trackingNo
                + "&ReviewStatusId=" + this.args.reviewStatusId
                + "&FromDate=" + this.args.fromDate
                + "&ToDate=" + this.args.toDate
                + "&PageSize=" + this.args.pageSize
                + "&PageNumber=" + (this.args.pageNumber <= 0 ? 1 : this.args.pageNumber)
                + "&PaymentType=" + this.args.paymentType
                + "&FactoryName=" + this.args.factoryName
                + "&FactoryTypeId=" + this.args.factoryTypeId
                + "&ApplicationType=" + this.args.applicationType
                + "&Source=" + this.args.source
                + "&ExportLcNo=" + encodeURIComponent(this.args.ExportLcNo)
                + "&ImportLcNo=" + encodeURIComponent(this.args.ImportLcNo)
                + "&CountryCode=" + this.args.CountryCode
                + "&UsedQty=" + this.args.UsedQty
                + "&Qty=" + this.args.Qty
                + "&QtyComparerOperator=" + this.args.QtyComparerOperator
                + "&Flagged=" + this.args.flagged;

            this.getUd(defaultUrl);
            $('#advancedSearch').collapse('hide');
        },

        getUd(url) {
            var vm = this;
            //var uri = encodeURIComponent(url);
            //console.log(uri);
            axios.get(url)
                .then(response => {
                    if (response.data) {
                        vm.pagination = response.data.MetaData;
                        response.data.Data.forEach((u) => {
                            u.Date = format(new Date(u.Date), "yyyy-MM-dd");
                        });
                        vm.uds = response.data.Data;
                    }
                });
        },

        setUdSession(udTracking, type) {
            if (type === "AM") {
                axios.post(this.services.udSessionSetUrl + udTracking)
                    .then(response => {
                        window.open("/AMPrint", '_blank');
                    });
            }
            else if (type === "UD") {
                axios.post(this.services.udSessionSetUrl + udTracking)
                    .then(response => {
                        window.open("/UDPrint", '_blank');
                    });
            }
        },

        updateReview(ud) {
            const vm = this;

            vm.$bvModal.msgBoxConfirm("Are you sure you want to update the status?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Yes",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.put(vm.services.updateReviewUrl + "/" + ud.Id, ud)
                        .then(function () {
                            vm.search();
                        }, function (error) {
                            vm.$bvModal.msgBoxOk(error.response.data, {
                                okVariant: "danger",
                                centered: true,
                                hideHeaderClose: false,
                                size: 'sm',
                                footerClass: "p-2"
                            });
                        });
                }
            });
        }



    }
});
