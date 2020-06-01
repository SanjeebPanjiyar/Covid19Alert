import Vue from "vue";
import axios from "axios";

Vue.component("submission", {
    props: {
        purpose: String,
        paymentUrl: String,
        submissionInfo: {},
        varificationStatus: {},
        status: {},
        order: {}
    },
    data() {
        return {
            services: {
                submit: "/Submission/Submit"
            },
            submissionType: "Normal",
            UnderGarmentRate1: 0,
            UnderGarmentRate2: 0,
            KnitRate: 0,
            WovenRate: 0,
            SweaterRate: 0,
            UnderGarmentQty1: 0,
            UnderGarmentQty2: 0,
            KnitQty: 0,
            WovenQty: 0,
            SweaterQty: 0
        };
    },

    mounted() {
        if (this.order !== null) {
            Vue.set(this, "submissionType", this.order.IsEmergency ? "Emergency" : "Normal");
            Vue.set(this, "UnderGarmentQty1", this.order.UnderGarmentQty1);
            Vue.set(this, "UnderGarmentQty2", this.order.UnderGarmentQty2);
            Vue.set(this, "KnitQty", this.order.KnitQty);
            Vue.set(this, "WovenQty", this.order.WovenQty);
            Vue.set(this, "SweaterQty", this.order.SweaterQty);
        }
    },

    computed: {
        isSubmitted() {
            return this.varificationStatus.ReviewStatusId === this.status.SUBMITTED;
        },

        underGarment1Total() {
            const vm = this;
            if (vm.UnderGarmentQty1) {
                var total = vm.UnderGarmentQty1 / vm.submissionInfo.ServiceChargeUnitFee[0].Value * vm.submissionInfo.ExportServiceChargeFee[0].Value;
                return total;
            }
            return 0;
        },
        underGarment2Total() {
            const vm = this;
            if (vm.UnderGarmentQty2) {
                var total = vm.UnderGarmentQty2 / vm.submissionInfo.ServiceChargeUnitFee[0].Value * vm.submissionInfo.ExportServiceChargeFee[1].Value;
                return total;
            }
            return 0;
        },
        knitTotal() {
            const vm = this;
            if (vm.KnitQty) {
                var total = vm.KnitQty / vm.submissionInfo.ServiceChargeUnitFee[0].Value * vm.submissionInfo.ExportServiceChargeFee[2].Value;
                return total;
            }
            return 0;
        },
        wovenTotal() {
            const vm = this;
            if (vm.WovenQty) {
                var total = vm.WovenQty / vm.submissionInfo.ServiceChargeUnitFee[0].Value * vm.submissionInfo.ExportServiceChargeFee[3].Value;
                return total;
            }
            return 0;
        },
        sweaterTotal() {
            const vm = this;
            if (vm.SweaterQty) {
                var total = vm.SweaterQty / vm.submissionInfo.ServiceChargeUnitFee[0].Value * vm.submissionInfo.ExportServiceChargeFee[4].Value;
                return total;
            }
            return 0;
        },
        totalPremium() {
            let total = (+this.underGarment1Total + +this.underGarment2Total + +this.knitTotal + +this.wovenTotal + +this.sweaterTotal) + this.submissionFee;
            return +total.toFixed(2);
        },

        allowSubmission() {
            const vm = this;
            return vm.varificationStatus.ReviewStatusId === vm.status.NEW || vm.varificationStatus.ReviewStatusId === vm.status.CORRECTION;
        },

        submissionFee() {
            if (this.submissionType) {
                return this.submissionInfo.SubmissionFee.find(x => x.Type === this.submissionType).Value;
            }
            return 0;
        }
    },

    methods: {
        submit() {
            if (!this.totalPremium) return;

            this.$bvModal.msgBoxConfirm("Are you sure?", { centered: true }).then(value => {
                const vm = this;

                if (value) {
                    let isEmergencyVal = this.submissionType === "Emergency";

                    let orderDto = {
                        ReferenceId: this.varificationStatus.ReferenceId,
                        UDAmendmentFee: this.submissionFee,
                        IsEmergency: isEmergencyVal,
                        ExportServiceCharge: this.exportServiceChargeValue,
                        ApplicationType: vm.purpose,
                        TotalFee: +vm.totalPremium,
                        UnderGarmentQty1: vm.UnderGarmentQty1,
                        UnderGarmentRate1: vm.submissionInfo.ExportServiceChargeFee[0].Value,
                        UnderGarmentQty2: vm.UnderGarmentQty2,
                        UnderGarmentRate2: vm.submissionInfo.ExportServiceChargeFee[1].Value,
                        KnitQty: vm.KnitQty,
                        KnitRate: vm.submissionInfo.ExportServiceChargeFee[2].Value,
                        WovenQty: vm.WovenQty,
                        WovenRate: vm.submissionInfo.ExportServiceChargeFee[3].Value,
                        SweaterQty: vm.SweaterQty,
                        SweaterRate: vm.submissionInfo.ExportServiceChargeFee[4].Value
                    };

                    axios.post(this.services.submit, orderDto).then(response => {
                        window.location.reload(true);
                    }, function (error) {
                        vm.$bvModal.msgBoxOk(error.response.data, {
                            okVariant: "danger",
                            centered: true,
                            hideHeaderClose: false,
                            size: "sm",
                            footerClass: "p-2"
                        });
                    });
                }
            });
        },

        redirectToPayment() {
            window.location = this.paymentUrl;
        }
    }
});
