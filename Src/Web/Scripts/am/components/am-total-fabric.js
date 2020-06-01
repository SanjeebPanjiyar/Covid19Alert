import Vue from "vue";
import axios from "axios";

Vue.component("am-total-fabric", {
    props: {
        informations: {},
        date: String
    },

    data() {
        return {
            model: {
                Date: this.date
            },
            list: {}
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
                    axios.post("/AMTotalFabric/Save", vm.model).then(response => {
                        if (response.status === 200) {
                            window.location.reload();
                        } else {
                            console.error("Error!");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            });
        }

    }
});