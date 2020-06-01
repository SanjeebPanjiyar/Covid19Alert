import Vue from "vue";
import axios from "axios";

Vue.component("buyerinfo-merge", {
    data() {
        return {
            errors: null,
            filter: {},
            filterBy: null,
            trackingList: null,
            selectedItem: null,
            services: {
                read: "/api/reviews/country",
                postBuyerInfoMerge: "/BuyerReport/BuyerInfoMerge/",
                udSessionSetUrl: "/Ud/SetSelectedUD?udTrackingNo="
            },
            model: {
                ToBeMergeId: null,
                MergedIds: null
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
        let country = "";
        let ToBeMergeId = '';
        let MergedIds = [];
        const vm = this;

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

        //$(document).off('click', '[data-click-checkbox]');
        //$(document).on('click', '[data-click-checkbox]', function (e) {
            
        //});

        $(document).off('click', '[data-click-radio]');
        $(document).on('click', '[data-click-radio]', function (e) {
            var idCtr = $(this).val().split('__');
            if (country !== idCtr[1]) {
                e.preventDefault();
            } else {
                $('#radVal').val(idCtr[0]);
                ToBeMergeId = idCtr[0];
            }
        });

        $(document).off('click', '#btnSave');
        $(document).on('click', '#btnSave', function (e) {
            if (MergedIds.length > 1 && ToBeMergeId) {
                vm.$bvModal.msgBoxConfirm("Are you sure to Merge these Buyer Info?", { centered: true }).then(value => {
                    if (value) {
                        var postModel = { ToBeMergeId: ToBeMergeId, MergedIds: MergedIds };
                        console.log('postModel', postModel);
                        axios.post(vm.services.postBuyerInfoMerge, postModel).then(response => {
                            console.log(response.data);
                            if (response.data === "OK") {
                                $('#bgmeabuyers-table').DataTable().clear().destroy();
                                vm.table = initTable();
                                var country = $("#ddlCountry option:selected").text();
                                vm.table.columns(3).search(country).draw();
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
                });
            } else {
                vm.$bvModal.msgBoxOk('Please select at least two checkboxes and must select a radio button.', {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
            }
        });

        let pageHeight = $(window).height() - ($('.app-header').height() + $('.app-header').height() + 350);

        this.table = initTable();

        $(this.table.table().container()).removeClass('form-inline');
        this.table.columns.adjust().draw();

        $('#bgmeabuyers-table').on("click", "input[type='checkbox']", function (e) {
            var tr = $(this).closest("tr");

            var thisCheck = $(this);
            var idCtr = thisCheck.val().split('__');
            if (country === "") {
                country = idCtr[1];
            }
            if (country !== idCtr[1]) {
                e.preventDefault();
                tr.removeClass('selected');
            } else {
                if (thisCheck.is(':checked')) {
                    MergedIds.push(idCtr[0]);
                    tr.addClass('selected');
                } else {
                    MergedIds.pop();
                    tr.removeClass('selected');
                    if (!MergedIds.length) {
                        country = "";
                    }
                }
            }
        });

        function initTable() {
            return $('#bgmeabuyers-table').DataTable({
                "ajax": {
                    "url": "/BuyerReport/LoadBgmeaBuyers",
                    "type": "POST",
                    "datatype": "json"
                },
                "pageLength": 100,
                "scrollX": true,
                "scrollY": pageHeight,
                "scrollCollapse": true,
                "retrieve": true,
                "columnDefs": [{
                    "targets": 0,
                    "searchable": false,
                    "orderable": false,
                    "className": "dt-body-center",
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox" data-click-checkbox="true" value="' + data.BGMEABuyerID + '__' + data.CountryName + '">';
                    }
                }, {
                    "targets": [1],
                    "visible": false,
                    "searchable": false,
                    "sortable": false
                }, {
                    "targets": 4,
                    "searchable": false,
                    "orderable": false,
                    "className": "dt-body-center",
                    "render": function (data, type, full, meta) {
                        return '<input type="radio" data-click-radio="true" name="radToBeMergeId" value="' + data.BGMEABuyerID + '__' + data.CountryName + '">';
                    }
                }],
                "columns": [
                    { "data": null, "defaultContent": "", "autoWidth": true },
                    { "data": "BGMEABuyerID", "name": "BGMEABuyerID", "autoWidth": true },
                    { "data": "BuyerName", "name": "BuyerName", "autoWidth": true },
                    { "data": "CountryName", "name": "CountryName", "autoWidth": true },
                    { "data": null, "defaultContent": "", "autoWidth": true }
                ],
                "order": [[2, "asc"]]
            });
        }

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
        
        select(item) {
            Vue.set(this, "selectedItem", item);
            this.$emit('selected', item.TrackingNumber);
        },
        clear() {
            Vue.set(this, "model", null);
        },
        save() {
            this.$bvModal.msgBoxConfirm("Are you sure to Merge these Buyer Info?", { centered: true }).then(value => {
                const vm = this;
                if (value) {
                    axios.post(vm.services.postBuyerInfoMerge, vm.model).then(response => {
                        console.log(response.data);
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
            });
        },
        search() {
            const vm = this;
            var country = $("#ddlCountry option:selected").text();
            vm.table.columns(3).search(country).draw();
        }
    }
});
