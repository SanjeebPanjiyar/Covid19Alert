import Vue from "vue";
import axios from "axios";

Vue.component("wallet", {
    props: {
        statements: Array,
        balance: Number
    },

    data() {
        return {
            amount: ""
        };
    },

    methods: {
        submit() {
            const vm = this;

            axios.post(`/Wallet/Recharge?amount=${this.amount}`).then(response => {
                window.location = response.data;
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
        }
    }
});
