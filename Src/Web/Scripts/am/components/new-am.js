import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import { format } from "date-fns";

Vue.component("new-am", {

    mixins: [form],

    props: {
        selectedAm: String,
        trackinglist: Array
    },

    data() {
        return {
            currentTrackinglist: this.trackinglist.length ? this.trackinglist : [],
            model: {
                SourceDateString: format(new Date(), "yyyy-MM-dd"),
                SourceRefDateString: format(new Date(), "yyyy-MM-dd"),
                UDDateString: format(new Date(), "yyyy-MM-dd"),
                BLNoDateString: format(new Date(), "yyyy-MM-dd"),
                VRegNoDateString: format(new Date(), "yyyy-MM-dd")
            },
            services: {
                update: "/am/update",
                read: "/am/read",
                delete: "/am/delete",
                set: "/am/setselectedam",
                get: "/am/getam?trackingnumber=",
                getTrackingList: "/am/GetTrackingList"
            }
        };
    },

    mounted() {
        const vm = this;

        Vue.set(vm, "model", {
            SourceDateString: format(new Date(), "yyyy-MM-dd"),
            SourceRefDateString: format(new Date(), "yyyy-MM-dd"),
            UDDateString: format(new Date(), "yyyy-MM-dd"),
            BLNoDateString: format(new Date(), "yyyy-MM-dd"),
            VRegNoDateString: format(new Date(), "yyyy-MM-dd")
        });
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.AmTrackingNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.FactoryType.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }

    },

    methods: {
        submit() {
            const vm = this;
            var confirmText = vm.selectedItem == null ? "Are you sure you want to save this information?" : "Are you sure you want to update this information?";
            var buttonText = vm.selectedItem == null ? "Save" : "Update";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.post(vm.services.update, vm.model).then(response => {
                        vm.handleSubmit();
                    }).catch(error => {
                        vm.processError(error);
                    });
                }
            });
        },

        reset() {
            const vm = this;

            vm.$refs.observer.reset();

            Vue.set(vm, "model", {
                SourceDateString: format(new Date(), "yyyy-MM-dd"),
                SourceRefDateString: format(new Date(), "yyyy-MM-dd"),
                UDDateString: format(new Date(), "yyyy-MM-dd"),
                BLNoDateString: format(new Date(), "yyyy-MM-dd"),
                VRegNoDateString: format(new Date(), "yyyy-MM-dd")
            });

            Vue.set(vm, "selectedItem", null);
            vm.$root.$emit("AMNoUpdated", "");
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "selectedItem", { ...item });

            axios.post(vm.services.set, vm.selectedItem).then(response => {
                Vue.set(vm, "model", response.data);
                vm.$root.$emit("AMNoUpdated", vm.model.AmTrackingNo);
            });
        },

        processList(response) {
            const vm = this;
            response.data.forEach(x => {
                x.SourceDateString = format(new Date(x.SourceDate), "yyyy-MM-dd"),
                    x.SourceRefDateString = format(new Date(x.SourceRefDate), "yyyy-MM-dd"),
                    x.UDDateString = format(new Date(x.UDDate), "yyyy-MM-dd"),
                    x.BLNoDateString = format(new Date(x.BLNoDate), "yyyy-MM-dd"),
                    x.VRegNoDateString = format(new Date(x.VRegNoDate), "yyyy-MM-dd")
            });

            Vue.set(vm, "list", response.data);
            if (vm.selectedAm) {
                var am = vm.list.filter(x => x.AmTrackingNo == vm.selectedAm)[0];
                if (am) {
                    vm.select(am);
                }
            }
        },

        updateTrackingList() {
            const vm = this;
            axios.get(vm.services.getTrackingList).then(response => {
                Vue.set(vm, "currentTrackinglist", response.data);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        handleSubmit(response) {
            const vm = this;
            vm.updateDefaultModel();
            vm.updateTrackingList();
            vm.read();
            vm.reset();
        },

        amChange() {
            const vm = this;

            if (vm.model.SourceTrackingNo) {
                axios.get(vm.services.get + vm.model.SourceTrackingNo).then(response => {
                    Vue.set(vm, "model", response.data);
                });
            }
        },

        remove() {
            const vm = this;
            axios.post(vm.services.delete, this.model).then(() => {
                vm.handleSubmit();
                vm.$root.$emit("AMNoUpdated", "");
            }).catch((error) => {
                vm.processError(error);
            });
        }
    }
});
