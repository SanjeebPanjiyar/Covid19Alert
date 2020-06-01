import Vue from "vue";
import axios from "axios";

Vue.component("am-required", {
    props: {
        AmRequiredInfoList: Array
    },

    data() {
        return {
            model: {},
            filterBy: null,
            selectedItem: null,
            errors: {},
            list: [ ...this.AmRequiredInfoList ],
            services: {
                read: "/AMRequired/Read",
                update: "/AMRequired/Update"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.list.filter(x => x.Sl.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.Description.toString().includes(vm.filterBy.toLowerCase().trim()));
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
                    axios.post(vm.services.update, this.model).then(response => {
                        vm.handleSubmit();
                    }).catch((error) => {
                        vm.processError(error);
                    });
                }
            });
        },

        read() {
            const vm = this;
            axios.get(vm.services.read).then(response => {
                Vue.set(vm, "list", response.data);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
        },

        handleSubmit(response) {
            const vm = this;
            vm.read();
            vm.reset();
        },

        processError(error) {
            console.error(error);
        }
    }
});
