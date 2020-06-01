import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("bank", {

    mixins: [form],

    props: {
        countries: Array
    },

    data() {
        return {
            services: {
                create: "/bank/create",
                update: "/bank/update",
                delete: "/bank/delete",
                read: "/bank/read"
            },
            selectedBranchCode: ""
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(m => m.BankCode.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    m.BankName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    methods: {
        resetnew() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
            Vue.set(vm, "selectedBranchCode", "");
        },

        reset() {
            const vm = this;
            vm.$refs.observer.reset();
            Vue.set(vm, "model", {});
            Vue.set(vm, "selectedItem", null);
            Vue.set(vm, "selectedBranchCode", "");
        },

        selectBranch() {
            const vm = this;
            if (vm.model.Branches) {
                var selectedBranch = vm.model.Branches.find(x => x.BranchCode == vm.selectedBranchCode);

                if (typeof selectedBranch !== "undefined") {
                    Vue.set(vm.model, "Id", selectedBranch.Id);
                    Vue.set(vm.model, "BranchName", selectedBranch.BranchName);
                    Vue.set(vm.model, "BranchCode", selectedBranch.BranchCode);
                }
            }
        },

        remove() {
            const vm = this;

            if (!vm.selectedBranchCode) {
                vm.$bvModal.msgBoxOk("Please select a branch to delete.", {
                    okVariant: "info",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
            }
            else {
                axios.post(vm.services.delete, this.model).then(response => {
                    vm.handleSubmit(response);
                    vm.reset();
                }).catch((error) => {
                    vm.processError(error);
                });
            }
        }
    }
});
