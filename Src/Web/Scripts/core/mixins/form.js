import Vue from "vue";
import axios from "axios";

export default {

    props: {
        defaultValues: Object
    },

    mounted() {
        const vm = this;
        if (vm.defaultValues) {
            Vue.set(vm, "defaultModel", vm.defaultValues);
        }
        vm.updateModel();
        vm.read();
    },

    data() {
        return {
            model: {},
            list: {},
            filterBy: null,
            selectedItem: null,
            errors: {},
            defaultModel: {}
        }
    },

    methods: {
        read() {
            const vm = this;
            axios.get(vm.services.read).then(response => {
                vm.processList(response);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        save() {
            const vm = this;
            axios.post(vm.services.create, this.model).then(response => {
                vm.reset();
                vm.handleSubmit(response);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        update() {
            const vm = this;
            axios.post(vm.services.update, vm.model).then(response => {
                vm.handleSubmit(response);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        submit() {
            const vm = this;
            var confirmText = vm.selectedItem === null ? "Are you sure you want to save this information?" : "Are you sure you want to update this information?";
            var buttonText = vm.selectedItem === null ? "Save" : "Update";

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
                        vm.save();
                    }
                    else {
                        vm.update();
                    }
                }
            });
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            vm.updateModel();
            Vue.set(vm, "selectedItem", null);
        },
        resetnew() {
            //new reset function for clear all the model data
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
        },

        confirmRemove() {
            const vm = this;

            vm.$bvModal.msgBoxConfirm("Are you sure you want to delete this information?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Delete",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value && vm.selectedItem) {
                    vm.remove();
                }
            });
        },

        remove() {
            const vm = this;

            axios.post(vm.services.delete, this.model).then(response => {
                vm.handleSubmit(response);
                vm.reset();
            }).catch((error) => {
                vm.processError(error);
            });
        },

        processList(response) {
            const vm = this;
            Vue.set(vm, "list", response.data);
        },

        updateModel(model) {
            const vm = this;
            Vue.set(vm, "model", model ? model : { ...vm.defaultModel });
        },

        updateDefaultModel() {
            const vm = this;
            if (vm.services.defaultModel) {
                axios.get(vm.services.defaultModel).then(response => {
                    Vue.set(vm, "defaultModel", response.data);
                    vm.updateModel();
                }).catch((error) => {
                    vm.processError(error);
                });
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
            }
        },

        processError(error) {
            console.log(error.response.data.Message);
            if (error.response && error.response.data && error.response.data.Message) {
                this.$bvModal.msgBoxOk(error.response.data.Message, {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
            }
        }
    }
};