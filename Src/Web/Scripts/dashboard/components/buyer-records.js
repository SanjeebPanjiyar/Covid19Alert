import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("buyer-records",
    {
        props: {
        },

        mounted() {

            let pageHeight = $(window).height() - ($('.app-header').height() + $('.app-header').height() + 350);
            var table = $("#buyerinfo-table").DataTable({
                "processing": true,
                "serverSide": true,
                "orderMulti": false,
                "ajax": {
                    "url": "/BuyerReport/LoadData",
                    "type": "POST",
                    "datatype": "json"
                },
                "scrollX": true,
                "scrollY": pageHeight,
                "scrollCollapse": true,
                "language": {
                    "loadingRecords": "<i class=\"fas fa-circle-notch fa-spin fa-3x text-center text-red\"><\/i>",
                    "search": "Search",
                    "searchPlaceholder": "by Buyer/Country Name"
                },
                "dom": "<\"row\"<\"col-sm-12 col-md-4\"l><\"col-sm-12 col-md-5\"B><\"col-sm-12 col-md-3\"f>><\"row\"<\"col-sm-12\"tr>><\"row\"<\"col-sm-12 col-md-5\"i><\"col-sm-12 col-md-7\"p>>",
                "buttons": {
                    "dom": {
                        "button": {
                            "tag": "button",
                            "className": "btn btn-sm btn-success"
                        }
                    },
                    "buttons": [
                        {
                            "extend": "csvHtml5",
                            "text": "<i class=\"fas fa-file-download dataTables__icon mr-1\"><\/i> Download Excel",
                            "titleAttr": "Export to Excel",
                            "exportOptions": {
                                columns: [2, 3]
                            }
                        }
                    ]
                },
                "columnDefs":
                    [{
                        "targets": [1],
                        "visible": false,
                        "searchable": false,
                        "sortable": false
                    }],
                "columns": [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": '<i class="fa fa-plus-circle ml-1 dataTables__icon text-success"></i><i class="fa fa-minus-circle ml-1 dataTables__icon text-danger"></i>',
                        "width": "2%"
                    },
                    { "data": "BGMEABuyerID", "name": "BGMEABuyerID", "autoWidth": true },
                    { "data": "BuyerName", "name": "BuyerName", "autoWidth": true },
                    { "data": "CountryName", "name": "CountryName", "autoWidth": true }
                ]
            });
            $(table.table().container()).removeClass('form-inline');
            $('#buyerinfo-table tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });
            function format(rowData) {
                var div = $('<div/>')
                    .addClass('loading')
                    .text('Loading...');
                $.ajax({
                    url: '/BuyerReport/LoadDetailsData',
                    type: 'POST',
                    data: {
                        bgmeaBuyerId: rowData.BGMEABuyerID
                    },
                    dataType: 'json',
                    success: function (json) {
                        div.html(json.html).removeClass('loading');
                    }
                });
                return div;
            }
        }
    });