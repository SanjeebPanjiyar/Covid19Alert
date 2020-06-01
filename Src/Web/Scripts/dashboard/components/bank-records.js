import Vue from "vue";
import axios from "axios";
import form from "../../core/mixins/form";

Vue.component("bank-records",
    {
        props: {
        },

        mounted() {

            let pageHeight = $(window).height() - ($('.app-header').height() + $('.app-header').height() + 350);

            var table = $("#bankinfo-table").DataTable({
                "processing": true, 
                "serverSide": true, 
                "orderMulti": false,
                "ajax": {
                    "url": "/BankRecord/LoadData",
                    "type": "POST",
                    "datatype": "json"
                },
                "scrollX": true,
                "scrollY": pageHeight,
                "scrollCollapse": true,
                "language": {
                    "loadingRecords": "<i class=\"fas fa-circle-notch fa-spin fa-3x text-center text-red\"><\/i>",
                    "search": "Search",
                    "searchPlaceholder": "in FactoryName"
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
                            "text": "<i class=\"fas fa-file-download dataTables__icon mr-1 \"><\/i> Download Excel",
                            "titleAttr": "Export to Excel"
                        }
                    ]
                },
                "columns": [
                    { "data": "MembershipID", "name": "MembershipID", "autoWidth": true },
                    { "data": "FactoryName", "name": "FactoryName", "autoWidth": true },
                    { "data": "BankName", "name": "BankName", "autoWidth": true },
                    { "data": "BranchName", "name": "BranchName", "autoWidth": true },
                    { "data": "BranchAddress", "name": "BranchAddress", "autoWidth": true },
                    { "data": "PhoneNo", "name": "PhoneNo", "autoWidth": true },
                    { "data": "FaxNo", "name": "FaxNo", "autoWidth": true },
                    { "data": "NBR_BankCode", "name": "NBR_BankCode", "autoWidth": true },
                    { "data": "NBR_BankName", "name": "NBR_BankName", "autoWidth": true },
                    { "data": "NBR_BranchCode", "name": "NBR_BranchCode", "autoWidth": true },
                    { "data": "NBR_BranchName", "name": "NBR_BranchName", "autoWidth": true }
                ]
            });
            $(table.table().container()).removeClass('form-inline');
            $('#bankinfo-table tbody').on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        }
    });