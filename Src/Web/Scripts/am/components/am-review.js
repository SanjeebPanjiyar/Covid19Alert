import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import { format } from "date-fns";

Vue.component("am-review", {

    mixins: [form],

    props: {
        reviewStatusDropdown: Array
    },

    data() {
        return {
            services: {
                create: "/ud/create",
                //update: "/udreview/update",
                addReviewStatus: "/AMReview/AddReview",
                read: "/AMReview/read",
                get: "/AMReview/Get?amTrackNo=",
                delete: "/ud/delete",
                set: "/AM/SetSelectedAM"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.AMTrackingNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    methods: {

        updateReviewStatus() {
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
                    var body = {
                        AmTrackingNo: vm.model.AmTrackingNo,
                        ReviewStatusId: vm.model.ReviewStatusId,
                        remarks: typeof vm.model.Remarks === "undefined" ? null : vm.model.Remarks
                    };
                    axios.post(vm.services.addReviewStatus, body)
                        .then(function () {
                            vm.read();
                            vm.select(vm.model);
                        }, function (response) {
                            console.error(response);
                        });
                }
            });
        },

        handleSubmit(response) {
            const vm = this;
            vm.updateDefaultModel();
            vm.read();
            vm.reset();
            vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: vm.model.AMTrackingNo });
        },

        reset() {
            const vm = this;

            vm.$refs.observer.reset();

            Vue.set(vm, "model", { ...vm.defaultModel });
            Vue.set(vm, "selectedItem", null);
            vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: "" });
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
            axios.post(vm.services.set, vm.model);
            axios.get(vm.services.get + item.AMTrackingNo)
                .then(function (response) {

                    Vue.set(vm, "model", response.data);
                    vm.model.ReviewHistory.sort(function (a, b) {
                        return new Date(b.EntryDate) - new Date(a.EntryDate);
                    });
                    vm.model.ShipmentDate = new Date(vm.model.ShipmentDate).toLocaleDateString();
                    vm.model.UDDate = new Date(vm.model.UDDate).toLocaleDateString();
                    vm.model.ReviewHistory.forEach((ud) => {
                        ud.EntryDate = ud.EntryDate !== null ? new Date(ud.EntryDate).toLocaleString() : null;
                    });
                });
            vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: vm.model.AMTrackingNo });
        }
    }
});
