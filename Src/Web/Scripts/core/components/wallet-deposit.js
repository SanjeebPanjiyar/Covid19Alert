import Vue from "vue";
import axios from "axios";

Vue.component("wallet-deposit", {
    data() {
        return {
            members: [{ MembershipID: "", FactoryName: "Select"}],
            depositModel: {
                MembershipID: ""
            }
        };
    },

    mounted() {
        axios.get("/MembershipInfo/Read").then(response => {
            this.members = this.members.concat(response.data);
        });
    },

    methods: {
        submit() {
            const vm = this;

            axios.post("/Wallet/SaveDeposit", this.depositModel).then(response => {
                vm.$bvModal.msgBoxOk("Deposit entry successful.", {
                    okVariant: "success",
                    centered: true,
                    hideHeaderClose: false,
                    size: "sm",
                    footerClass: "p-2"
                });
            }).catch((error) => {
                if (error.response && error.response.data) {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: "sm",
                        footerClass: "p-2"
                    });
                }
            });
        },
    }
});
