import axios from "axios";
import { format } from "date-fns";

export default {
    data() {
        return {
            moneyReceipts: Array
        };
    },

    mounted() {
        this.$root.$on("UDNoUpdated", ({ updatedUDTrackingNo }) => {
            if (updatedUDTrackingNo) {
                axios.get(`/MoneyReceipt/GenerateMoneyReceipt?trackingNo=${updatedUDTrackingNo}`).then(response => {
                    if (response.data) {
                        this.moneyReceipts = response.data;

                        this.moneyReceipts.forEach((u) => {
                            u.PaymentDate = format(new Date(u.PaymentDate), "dd-MM-yyyy hh:mm");
                        });
                    } else {
                        this.moneyReceipts = [];
                    }
                });
            }
        });

        this.$root.$on("AMNoUpdated", (updatedUDTrackingNo) => {
            if (updatedUDTrackingNo) {
                axios.get(`/MoneyReceipt/GenerateMoneyReceipt?trackingNo=${updatedUDTrackingNo}`).then(response => {
                    if (response.data) {
                        this.moneyReceipts = response.data;

                        this.moneyReceipts.forEach((u) => {
                            u.PaymentDate = format(new Date(u.PaymentDate), "dd-MM-yyyy hh:mm");
                        });
                    } else {
                        this.moneyReceipts = [];
                    }
                });
            }
        });
    }
};
