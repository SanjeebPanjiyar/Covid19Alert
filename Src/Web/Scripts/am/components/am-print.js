import Vue from "vue";
import axios from "axios";

import form from "../../core/mixins/form";
import moneyReceipt from "../../core/mixins/money-receipt";

Vue.component("am-print", {

    mixins: [form, moneyReceipt],

    props: {
        selectedAm: String
    },

    data() {
        return {
            uploadedDocuments: Array,
            model: {},
            services: {
                read: "/amprint/read",
                set: "/amprint/setSelectedAm?",
                getPrintModel: "/amprint/getPrintModel?amTrackingNo=",
                getUploadedDocuments: "/api/reviews/UploadedDocuments?trackingNo="
            }
        };
    },

    computed: {
        filteredList() {
            const vm = this;
            if (vm.filterBy) {
                return vm.list.filter(x => x.MembershipID.toLowerCase().includes(vm.filterBy.toLowerCase().trim()) ||
                    x.AmTrackingNo.toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }
            return vm.list;
        }
    },

    mounted() {
        this.$root.$on("AMNoUpdated", (updatedUDTrackingNo) => {
            if (updatedUDTrackingNo) {
                axios.get(this.services.getUploadedDocuments + updatedUDTrackingNo).then(response => {
                    this.uploadedDocuments = response.data;
                });
            }
        });

        this.printam();
    },

    methods: {
        processList(response) {
            const vm = this;
            Vue.set(vm, "list", response.data);
            if (vm.selectedAm) {
                var am = vm.list.filter(x => x.AmTrackingNo === vm.selectedAm)[0];
                if (am) {
                    vm.select(am);
                }
            }
        },

        printam() {
            const vm = this;
            axios.get(vm.services.getPrintModel + ((typeof vm.model.AmTrackingNo === 'undefined') ? "" : vm.model.AmTrackingNo)).then(response => {
                vm.formatMeasurementChart(response.data.MeasurementCharts);
                Vue.set(vm, "model", { ...response.data });
            });
        },

        select(item) {
            const vm = this;
            Vue.set(vm, "model", { ...item });
            Vue.set(vm, "selectedItem", { ...item });
            document.title = vm.model.AmTrackingNo;
            Vue.nextTick(function () {
                vm.$root.$emit("AMNoUpdated", vm.model.AmTrackingNo);
                axios.post(vm.services.set + 'amTrackingNo=' + vm.model.AmTrackingNo).then(response => {
                    vm.printam();
                });
            });
        },

        formatMeasurementChart(measurementChart) {
            if (measurementChart) {
                measurementChart.forEach(function (x) {
                    let table = [];

                    for (let i = 0; i < x.Table.length; i++) {
                        let row = x.Table[i];
                        let columns = [];

                        for (let j = 0; j < row[`row${i}`].length; j++) {
                            columns.push(row[`row${i}`][j][`column${j}`]);
                        }

                        table.push(columns);
                    }

                    x.Table = table;
                });
            }
        }
    }
});
