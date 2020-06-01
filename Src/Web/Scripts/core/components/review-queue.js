import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";

Vue.component("review-queue", {
    data() {
        return {
            services: {
                consumptionUrl: "/UDPrint/GetConsumptionByTrackingNo?trackingNo=",
                updateReviewUrl: "/api/reviews/queue",
                reviewHistoriesUrl: "/api/reviews/histories?trackingNo=",
                searchUrl: "/api/reviews/queue?trackingNo=",
                udSessionSetUrl: "/Ud/SetSelectedUD?udTrackingNo=",
                updateReviewStatusUrl: "/api/reviews/update-review-status",
            },

            uds: [],
            supportiveDocuments: Array,
            reviewHitories: Array,
            annexThree: {},
            uploadedDocs: [],
            trackingNo: ""
        };
    },

    mounted() {
        const vm = this;

        axios.get(vm.services.updateReviewStatusUrl).then(response => {
            vm.updateReviewStatus = response.data;
        });

        vm.$root.$on("bv::collapse::state", (data, isJustShown) => {
            if (isJustShown) {
                //if (data.endsWith("doc")) {
                //    axios.get(this.services.docs + data.split("doc")[0]).then(response => {
                //        let ud = vm.uds.find(u => u.ReferenceId === data.split("doc")[0]);
                //        Vue.set(ud, 'SupportiveDocs', response.data);
                //    });
                //}
                //else if (data) {
                //    vm.fetchReviewHitories(data);
                //}

                if (data) {
                    vm.fetchReviewHitories(data);
                }
            }
        });
    },

    methods: {

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

        load() {
            var vm = this;
            Vue.set(vm, "trackingNo", vm.trackingNo);

            axios.get(vm.services.searchUrl + vm.trackingNo)
                .then(response => {
                    if (response.data) {
                        response.data.forEach((u) => {
                            u.Date = format(new Date(u.Date), "yyyy-MM-dd");
                        });
                        vm.uds = response.data;
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
                    ud.ScrutineerId = vm.primaryScrutineerId === "" ? vm.secondaryScrutineerId : vm.primaryScrutineerId;
                    axios.put(vm.services.updateReviewUrl + "/" + ud.Id, ud)
                        .then(function () {
                            vm.uds.splice(ud, 1);
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
