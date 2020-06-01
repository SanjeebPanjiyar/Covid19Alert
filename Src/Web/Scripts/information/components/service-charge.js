import Vue from "vue";
import form from "../../core/mixins/form";
import axios from "axios";

Vue.component("service-charge", {

    mixins: [form],
    props: {
        //serviceTypes: Array,
        //servicePurpose: Array
    },
    data() {
        return {
            services: {
                create: "/ServiceCharge/create",
                read: "/ServiceCharge/read",
                update: "/ServiceCharge/update",
                delete: "/ServiceCharge/delete"
            },
            model: {
                Purpose: "",
                Type:"",
                Value: 0,
            },
            selectedItem: {}
        };
    },
    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x =>
                    x.Type.toLowerCase().includes(vm.filterBy.toLowerCase().trim())
                    || x.Purpose.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },
    methods: {
        updateService() {
            const vm = this;
            console.log();
            axios.post(vm.services.update, vm.model).then(response => {
                vm.read();
            }).catch((error) => {
                vm.processError(error);
            });
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
        },

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
                    //if (vm.selectedItem === null) {
                    //    vm.model.MUnitName = vm.model.MUnitName.toUpperCase();
                    //    vm.save();
                    //} else {
                    vm.update();
                    //}
                }
            });
        }
    }
});
