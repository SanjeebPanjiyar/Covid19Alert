import Vue from "vue";
import axios from "axios";

Vue.component("payment", {
    props: {
        trackingNo: String,
        successUrl: String,
        failUrl: String,
        cancelUrl: String,
        getGeneralInfoApi: String,
        getConsumptionsApi: String
    },

    data() {
        return {
            walletBalance: 0,
            annexThree: {},
            serviceCharges: {},
            generalInfo: {},
            isPaid: false,
            totalPayment: 0
        };
    },

    computed: {
        grandCharge(){
            if (!this.isPaid && this.totalPayment < this.serviceCharges.TotalFee)
                return (this.serviceCharges.TotalFee - this.totalPayment).toFixed(2);

            return this.serviceCharges.TotalFee;
        }
    },

    mounted() {
        const vm = this;

        axios.get(vm.getGeneralInfoApi).then(response => {
            vm.generalInfo = response.data;
        });

        axios.get("/Wallet/GetCurrentBalance").then(response => {
            vm.walletBalance = response.data;
        });

        axios.get(vm.getConsumptionsApi).then(response => {
            vm.annexThree = response.data;
        });

        axios.get(`/ServiceCharge/GetServiceCharge?trackingNo=${vm.trackingNo}`).then(response => {
            vm.serviceCharges = response.data;
        });

        axios.get(`/Payment/IsPaid?trackingNo=${vm.trackingNo}`).then(response => {
            vm.isPaid = response.data.IsPaid;
            if (response.data.TotalPayment) {
                Vue.set(vm, "totalPayment", response.data.TotalPayment);
            }
        });
    },

    methods: {
        sslCheckout() {
            axios.post("/Payment/SSLCheckout", {
                TrackingNo: this.trackingNo,
                SuccessUrl: this.successUrl,
                FailUrl: this.failUrl,
                CancelUrl: this.cancelUrl
            }).then(response => {
                window.location = response.data;
            }).catch(error => {
                if (error.response && error.response.data) {
                    this.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: "sm",
                        footerClass: "p-2"
                    });
                }
            });
        },

        paymentViaWallet() {
            this.$bvModal.msgBoxConfirm("Are you sure you want to pay from your wallet?", { centered: true }).then(value => {
                if (value) {
                    axios.post("/Wallet/MakePayment", {
                        TrackingNo: this.trackingNo
                    }).then(response => {
                        this.$bvModal.msgBoxOk(response.data, {
                            okVariant: "success",
                            centered: true,
                            hideHeaderClose: false,
                            size: "sm",
                            footerClass: "p-2"
                        }).then(() => {
                            window.location.reload(true);
                        });
                    }).catch(error => {
                        if (error.response && error.response.data) {
                            this.$bvModal.msgBoxOk(error.response.data, {
                                okVariant: "danger",
                                centered: true,
                                hideHeaderClose: false,
                                size: "sm",
                                footerClass: "p-2"
                            });
                        }
                    });
                }
            });
        }
    }
});
