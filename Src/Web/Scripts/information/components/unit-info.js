import Vue from "vue";
import form from "../../core/mixins/form";
import axios from "axios";

Vue.component("unit-info", {

    mixins: [form],

    data() {
        return {
            services: {
                create: "/unitinfo/create",
                read: "/unitinfo/read",
                update: "/unitinfo/update",
                delete: "/unitinfo/delete"
            }
        };
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
                    if (vm.selectedItem === null) {
                        vm.model.MUnitName = vm.model.MUnitName.toUpperCase();
                        vm.save();
                    } else {
                        vm.update();
                    }
                }
            });
        },

        update() {
            const vm = this;

            axios.post(vm.services.update, vm.model)
                .then((response) => {
                    vm.reset();
                    vm.handleSubmit(response);
                })
                .catch((error) => {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                });

        },

        remove() {
            const vm = this;

            axios.post(vm.services.delete, vm.model)
                .then((response) => {
                    vm.reset();
                    vm.handleSubmit(response);
                })
                .catch((error) => {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                });
        }
    },
    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.MUnitID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.MUnitName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    }
});
