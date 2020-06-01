import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("ud-lien-bank-info", {

    mixins: [form],

    props: {
        banks: Array
    },

    data() {
        return {
            services: {
                create: "/udlienbank/create",
                read: "/udlienbank/read",
                delete: "/udlienbank/delete",
                get: "/udlienbank/GetBankInfo"
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.BankId.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.BankName.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) );
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
                    vm.save();
                }
            });            
        },

        onChange() {
            const vm = this;

            axios.get(`${vm.services.get}?bankId=${vm.model.BankId}`).then(response => {
                if (response.data !== false) {
                    Vue.set(vm, "model", response.data);
                } else {
                    vm.$bvModal.msgBoxOk("No information found!", {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                }
            });
        }
    }
});
