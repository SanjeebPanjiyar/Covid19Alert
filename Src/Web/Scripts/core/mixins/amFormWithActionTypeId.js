import Vue from "vue";
import axios from "axios";

export default {
    props: {
        newActionList: Array,
        oldActionList: Array
    },

    computed: {
        allowedActions() {
            return this.model.ShowNewAction ? this.newActionList : this.oldActionList;
        },

        isInDeAction() {
            return this.model.ActionTypeId == 2 || this.model.ActionTypeId == 3;
        }
    },

    data() {
        return {
            history: "",
            hasHistory: false
        }
    },

    mounted() {
        Vue.set(this.model, "ShowNewAction", true);
    },

    methods: {

        resetnew() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
            Vue.set(vm.model, "ShowNewAction", true);
            vm.$refs.observer.reset();
        },

        update() {
            const vm = this;
            axios.post(vm.services.update, vm.model).then(response => {
                vm.handleSubmit();
                vm.handleReplaceAction(vm.model);
            }).catch((error) => {
                vm.processError(error);
            });
        },

        select(item) {
            const vm = this;

            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
            vm.handleReplaceAction(vm.model);
        },

        handleReplaceAction(item) {
            const vm = this;
            if (item.ActionTypeId == 4) {
                axios.post(vm.services.getHistory, vm.model).then(response => {
                    if (response.data) {
                        vm.processHistory(response.data);
                        Vue.set(vm, "hasHistory", true);
                    } else {
                        vm.processHistory({ ...vm.model });
                        Vue.set(vm, "hasHistory", false);
                    }
                }).catch((error) => {
                    vm.processError(error);
                });
            }
            else {
                vm.processHistory({ ...vm.model });
                Vue.set(vm, "hasHistory", false);
            }
        },

        undoReplace() {
            const vm = this;
            vm.$bvModal.msgBoxConfirm("Are you sure you want to undo the replace action?", {
                okVariant: "info",
                okTitle: "Yes",
                cancelTitle: "Cancel",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.post(vm.services.deleteHistory, vm.model).then(response => {
                        vm.handleSubmit();
                    }).catch((error) => {
                        vm.processError(error);
                    });
                }
            });
        },

        processHistory(model) {
            const vm = this;
            Vue.set(vm, "history", model);
        }
    }
};