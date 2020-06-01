import Vue from "vue";
import axios from "axios";

Vue.component("user-profile", {
    props: {
        signature: {},
        user: {},
        uploadSignatureMessage: String
    },

    data() {
        return {
            model: {},
            error: null,
            success : null,
            services: {
                update: "/UserProfile/Update",
                deleteSignature: "/UserProfile/RemoveSignature",
                changePassword: "/UserProfile/ChangePassword"
            },
            password: {
                CurrentPassword: null,
                NewPassword: null,
                ConfirmPassword: null
            }
        };
    },

    mounted() {
        this.model = this.user;
        const vm = this;

        if (vm.$props.uploadSignatureMessage) {
            vm.$bvModal.msgBoxOk(vm.$props.uploadSignatureMessage, {
                okVariant: "danger",
                centered: true,
                hideHeaderClose: false,
                size: "sm",
                footerClass: "p-2"
            });
        }
    },

    methods: {
        submit() {
            const vm = this;
            var confirmText ="Are you sure you want to save this information?";
            var buttonText = "Update";

            vm.$bvModal.msgBoxConfirm(confirmText, {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: buttonText,
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    vm.update();
                }
            });
        },

        update() {
            axios.post(this.services.update, this.model).then(() => {
                window.location.reload(true);
            }).catch((error) => {
                Vue.set(this, "error", error.response.data);
                Vue.set(this, "success", null);
            });
        },

        changePassword() {
            axios.post(this.services.changePassword, this.password).then(() => {
                Vue.set(this, "success", "Successful");
                Vue.set(this, "error", null);
            }).catch((error) => {
                Vue.set(this, "error", error.response.data);
                Vue.set(this, "success", null);
            });
        },

        sendEmailConfirmationLink() {
            axios.get("/UserProfile/SendEmailConfirmationLink").then(() => {
                this.$bvModal.msgBoxOk("Email sent!", {
                    okVariant: "success",
                    centered: true,
                    hideHeaderClose: false,
                    size: "sm",
                    footerClass: "p-2"
                });
            });
        },

        sendPhoneVerificationCode() {
            axios.get("/UserProfile/SendMobileVerificationCode").then(() => {
                this.$bvModal.msgBoxOk("Verification code sent! Please check you mobile.", {
                    okVariant: "success",
                    centered: true,
                    hideHeaderClose: false,
                    size: "sm",
                    footerClass: "p-2"
                });
            });
        },

        deleteClick() {
            const vm = this;
            this.$bvModal.msgBoxConfirm("Are you sure you want to delete this Signature?", {
                okVariant: "info",
                cancelTitle: "Cancel",
                okTitle: "Delete",
                centered: true,
                hideHeaderClose: false,
                footerClass: "p-2"
            }).then(value => {
                if (value) {
                    axios.get(vm.services.deleteSignature).then(() => {
                        window.location.reload(true);
                    });
                }
            });
        }
    }
});
