import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";
import { format } from "date-fns";

Vue.component("new-ud", {

    mixins: [form],

    props: {
        selectedUd: String,
        factoryTypes: Array
    },

    data() {
        return {
            services: {
                create: "/ud/create",
                update: "/ud/update",
                read: "/ud/read",
                delete: "/ud/delete",
                get: "/ud/get?udTrackingNo=",
                set: "/ud/setselectedud?udTrackingNo=",
                duplicate: "/ud/DuplicateUD"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.MembershipID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.UDTrackingNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    mounted() {
        const vm = this;

        vm.model.BLDate = format(new Date(vm.model.BLDate), "yyyy-MM-dd");
        vm.model.VatRegDate = format(new Date(vm.model.VatRegDate), "yyyy-MM-dd");
        vm.model.UDDate = format(new Date(vm.model.UDDate), "yyyy-MM-dd");
        vm.model.ApplicationDate = format(new Date(vm.model.ApplicationDate), "yyyy-MM-dd");
    },

    methods: {
        processList(response) {
            const vm = this;
            response.data.forEach((ud) => {
                ud.UDDate = ud.UDDate !== null ? format(new Date(ud.UDDate), "dd/MM/yyyy") : null;
            });
            Vue.set(vm, "list", response.data);
            if (vm.selectedUd) {
                var ud = vm.list.filter(x => x.UDTrackingNo == vm.selectedUd)[0];
                if (ud) {
                    vm.select(ud);
                }
            }
        },

        handleSubmit(response) {
            const vm = this;

            if (response && response.data && response.data.Message) {
                vm.$bvModal.msgBoxOk(response.data.Message, {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
            }
            else {
                vm.updateDefaultModel();
                vm.read();
                vm.reset();
                vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: vm.model.UDTrackingNo, updatedUDStatus: vm.model.ReviewStatusId });
            }
        },

        resetnew() {
            const vm = this;

            vm.$refs.observer.reset();

            Vue.set(vm, "model", { ...vm.defaultModel });
            vm.formatModelDates();

            Vue.set(vm, "selectedItem", null);
            vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: "", updatedUDStatus: "" });
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });

            axios.post(vm.services.set + vm.model.UDTrackingNo).then(() => {
                axios.get(vm.services.get + vm.model.UDTrackingNo).then((response) => {
                    Vue.set(vm, "model", response.data);
                    vm.formatModelDates();
                    vm.$root.$emit("UDNoUpdated", { updatedUDTrackingNo: vm.model.UDTrackingNo, updatedUDStatus: vm.model.ReviewStatusId });
                });
            });            
        },

        formatModelDates() {
            const vm = this;

            vm.model.BLDate = format(new Date(vm.model.BLDate), "yyyy-MM-dd");
            vm.model.VatRegDate = format(new Date(vm.model.VatRegDate), "yyyy-MM-dd");
            vm.model.ApplicationDate = format(new Date(vm.model.ApplicationDate), "yyyy-MM-dd");
            vm.model.UDDate = format(new Date(vm.model.UDDate), "yyyy-MM-dd");
        },

        duplicatePost() {
            console.log(this.model);
            const vm = this;
            axios.post(vm.services.duplicate, this.model).then(response => {
                vm.reset();
                vm.handleSubmit(response);
            }).catch((error) => {
                console.log(error.response.data);
            });
        },
        duplicate() {
            const vm = this;
            var confirmText = "Are you sure you want to duplicate this UD?";
            var buttonText = "Yes";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                vm.duplicatePost();
                }
            });
        },
    }
});
