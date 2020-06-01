import Vue from "vue";
import axios from "axios";

Vue.component("udam-report", {
    data() {
        return {
            errors: null,
            filter: {},
            filterBy: null,
            trackingList: null,
            selectedItem: null,
            services: {
                read: "/api/reviews/factory",
                getTrackingList: "/ReportFilter/GetTrackingInfo",
                udSessionSetUrl: "/Ud/SetSelectedUD?udTrackingNo="
            },
            model: {
                MembershipId: null,
                TrackingType: null,
                TrackingNumber: null
            },
            args: this.$options.args,
            lcTypes: this.$options.lcTypes,
            table: null
        };
    },
    created() {
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "date-uk-pre": function (a) {
                if (a == null || a == "") {
                    return 0;
                }
                var ukDatea = a.split('/');
                return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
            },

            "date-uk-asc": function (a, b) {
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            },

            "date-uk-desc": function (a, b) {
                return ((a < b) ? 1 : ((a > b) ? -1 : 0));
            }
        });

        this.getFilterData();
    },

    mounted() {

        $(document).off('click', '[data-click-span]');
        $(document).on('click', '[data-click-span]', function (e) {
            e.preventDefault();
            var udTracking = $(this).attr("id").split("__")[1];
            var length = udTracking.length;
            if (length === 13) {
                axios.post("/Ud/SetSelectedUD?udTrackingNo=" + udTracking)
                    .then(response => {
                        window.open("/UDPrint", '_blank');
                    });
            }
            else {
                axios.post("/Ud/SetSelectedUD?udTrackingNo=" + udTracking)
                    .then(response => {
                        window.open("/AMPrint", '_blank');
                    });
            }
        });

        let pageHeight = $(window).height() - ($('.app-header').height() + $('.app-header').height() + 350);

        this.table = $("#udamreport-table").DataTable({
            "language": {
                "search": "Filter",
                "searchPlaceholder": "by TrackingNumber"
            },
            "pageLength": 100,
            "scrollX": true,
            "scrollY": pageHeight,
            "scrollCollapse": true,
            "columnDefs": [{
                "targets": [2],
                "sortable": false
            },
            { "className": "text-center", "targets": "_all" },
            { "type": "date-uk", "targets": [1] }
            ],
            "order": [[1, "desc"]],
            "dom": "<\"row\"<\"col-sm-12 col-md-4\"l><\"col-sm-12 col-md-3\"f>><\"row\"<\"col-sm-12\"tr>><\"row\"<\"col-sm-12 col-md-5\"i><\"col-sm-12 col-md-7\"p>>",
            "responsive": true
        });

        $(this.table.table().container()).removeClass('form-inline');
        this.table.columns.adjust().draw();
    },

    computed: {
        filteredList() {
            const vm = this;

            if (vm.filterBy) {
                return vm.trackingList.filter(x => x.TrackingNumber.toString().toLowerCase().includes(vm.filterBy.toLowerCase().trim()));
            }

            return vm.trackingList;
        }
    },

    methods: {
        getFilterData() {
            const vm = this;

            axios.get(vm.services.read)
                .then(response => {
                    Vue.set(vm, "filter", response.data);
                })
                .catch((error) => {
                    vm.$bvModal.msgBoxOk(error.response.data, {
                        okVariant: "danger",
                        centered: true,
                        hideHeaderClose: false,
                        size: 'sm',
                        footerClass: "p-2"
                    });
                    Vue.set(vm, "errors", error.response.data);
                });
        },
        /*
        setUdSession(udTracking) {
            var length = udTracking.length;
            if (length === 13) {
                axios.post(this.services.udSessionSetUrl + udTracking)
                    .then(response => {
                        window.open("/UDPrint", '_blank');
                    });
            }
            else {
                axios.post(this.services.udSessionSetUrl + udTracking)
                    .then(response => {
                        window.open("/AMPrint", '_blank');
                    });
            }
        },
        */

        select(item) {
            Vue.set(this, "selectedItem", item);
            this.$emit('selected', item.TrackingNumber);
        },
        clear() {
            Vue.set(this, "model", null);
        },
        search() {
            const vm = this;
            axios.post(vm.services.getTrackingList, vm.model).then(response => {
                console.log(response.data);
                vm.table.clear().draw();
                for (let i = 0; i < response.data.length; i++) {
                    var lnk = '<span id="' + i + '__' + response.data[i].TrackingNumber +'" class="btn-link" style="cursor:pointer" data-click-span="true">' + response.data[i].TrackingNumber + '</span> ';
                    var lnk1 = '<a href="/UdAmReport/FabricReport?trackingNumber=' + response.data[i].TrackingNumber + '" target="_blank">Fabric Report</a> ';
                    var lnk2 = '<a href="/UdAmReport/ExpImpLcReport?trackingNumber=' + response.data[i].TrackingNumber + '&lcType=Exp" target="_blank">Export LC Report</a> ';
                    var lnk3 = '<a href="/UdAmReport/ExpImpLcReport?trackingNumber=' + response.data[i].TrackingNumber + '&lcType=Imp" target="_blank">Import LC Report</a> ';
                    vm.table.row.add([lnk, response.data[i].UDDate, lnk1 + " | " + lnk2 + " | " + lnk3]).draw(false);
                }
            }).catch((error) => {
                vm.$bvModal.msgBoxOk(error.response.data, {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
                Vue.set(vm, "errors", error.response.data);
            });
        }
    }
});
