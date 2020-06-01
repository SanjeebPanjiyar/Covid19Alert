import Vue from "vue";
import axios from "axios";
import { format } from "date-fns";

Vue.component("payment-records", {
    props: {
    },
    data() {
        return {
            services: {
                searchUrl: "/api/transactions?",
                foctoryTypesUrl: "/api/reviews/factoryType"
            },
            args: {
                paymentType: "ALL",
                fromDate: "",
                toDate: "",
                trackingNo: "",
                factoryTypeId: "",
                source: "ALL"
            },
            transactions: [],
            factoryTypes: [],
            total: 0
        };
    },

    mounted() {
        const vm = this;

        axios.get(vm.services.foctoryTypesUrl).then(response => {
            vm.factoryTypes = response.data;
        });
    },

    methods: {

        clear() {
            this.args = {
                paymentType: "ALL",
                fromDate: "",
                toDate: "",
                trackingNo: "",
                factoryTypeId: "",
                source: "ALL"
            };
        },

        search() {

            let defaultUrl = this.services.searchUrl
                + "TrackingNo=" + this.args.trackingNo
                + "&FromDate=" + this.args.fromDate
                + "&ToDate=" + this.args.toDate
                + "&PaymentType=" + this.args.paymentType
                + "&FactoryTypeId=" + this.args.factoryTypeId
                + "&Source=" + this.args.source;

            this.getTransactions(defaultUrl);
        },

        getTransactions(url) {
            var vm = this;
            vm.total = 0;
            axios.get(url)
                .then(response => {
                    if (response.data) {
                        if (response.data) {
                            response.data.forEach((u) => {
                                u.PaymentDate = format(new Date(u.PaymentDate), "yyyy-MM-dd");
                                vm.total += Number(u.PaidAmount);
                            });
                            vm.transactions = response.data;

                        }
                    }
                });
        }


    }

});
