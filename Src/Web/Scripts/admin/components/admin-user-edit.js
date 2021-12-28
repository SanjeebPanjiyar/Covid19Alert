import Vue from "vue";
import axios from "axios";

Vue.component("admin-user-edit", {

    data() {
        return {
            services: {
                saveLocation: "/Account/GetCountOfNearByPatients",
                setConsent: "/Account/SetConsent"
            },
            model: {},
            Count: 0,
            ConsentGiven:false,
            UsernameValidationMsg: null,
            options : {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        };
    }, mounted() {
        var table = $('#userlist').DataTable({
            "ajax": "/admin/GetUserList",
            "columns": [
                { "data": "IdNumber" },
                { "data": "FirstName" },
                { "data": "LastName" },
                { "data": "PhoneNumber" },
                { "data": "EmailAddress" },
                {
                    "data": "CovidStatus", "width": "50px", "render": function (value) {
                        if (value == true) {
                            return '✔';
                        }
                        else return '✘';
                    }
                },
                {
                    "data": "CovidStatus", "width": "50px", "render": function (value) {
                        if (value == true) {
                            return '<button>Tested As Negative</button>';
                        }
                        else return '<button>Tested As Positive</button>';
                    }
                }
            ]
        });
        $('#userlist tbody').on('click', 'button', function () {
            var data = table.row($(this).parents('tr')).data();
            axios.get("/admin/updatestatus/" + data["Id"]).then(response => {
                $('#userlist').DataTable().ajax.reload();
            }).catch((error) => {
                console.log(error.response.data);
            });
        });  
    },

    computed: {
       
    },

    methods: {

    }
});
