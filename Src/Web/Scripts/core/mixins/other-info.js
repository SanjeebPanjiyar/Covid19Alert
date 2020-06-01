import Vue from "vue";
import axios from "axios";

export default {
    props: {
        informations: Array
    },

    data() {
        return {
            model: this.informations,
            errors: {}
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
                    axios.post(vm.services.create, vm.model.filter(a => a.Checked)).then(response => {
                        if (response.status !== 200) {
                            vm.processError(error);
                        }
                    }).catch((error) => {
                        vm.processError(error);
                    });
                }
            });
        },

        processError(error) {
            console.error(error);
        }
    }
};