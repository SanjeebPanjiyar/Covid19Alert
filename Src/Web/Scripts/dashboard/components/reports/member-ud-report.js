import Vue from "vue";
import axios from "axios";
import Highcharts from "highcharts";
import exportingInit from 'highcharts/modules/exporting';

Vue.component("member-ud-report", {
    data() {
        return {
            errors: null,
            services: {
                totalUdAmUrl: "/api/UDReports/totalUdAm",
                operationYearsUrl: "/api/UDReports/operationYear",
                dateWiseUdAmReportUrl: "/api/UDReports/month?",
                yearWiseUdAmReportUrl: "/api/UDReports/year?",
                statusCounterUrl: "/api/UDReports/status?date=",
            },
            years: [],
            reportMonths: [],
            reportMonth: new Date().toLocaleString('default', { month: 'long' }),
            statusCounterDate: new Date().toISOString().slice(0, 10),
            totalUdAm: [],
            reportYear: new Date().getFullYear(),
            filterYear: ''
        };
    },

    created() {

    },

    mounted() {
        exportingInit(Highcharts);
        for (var m = 1; m < 13; m++) {
            this.reportMonths.push(new Date('2000-' + m + '-01').toLocaleString('default', { month: 'long' }));
        }
        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        this.getDateWiseData();
        this.getYearWiseData();
        this.countTotalUdAm();
        this.getOperationYears();
        this.countCurrentUdAmStatus();
    },

    computed: {

    },

    methods: {

        buildLineChart(id, type, title, subtitle, yAxisTitle, categories, series) {
            Highcharts.chart(id, {
                chart: {
                    type: type
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: subtitle
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: yAxisTitle
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                series: series,
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                responsive: {
                    rules: [{
                        condition: {
                            //maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });
        },

        countCurrentUdAmStatus() {
            var vm = this;
            axios.get(vm.services.statusCounterUrl + vm.statusCounterDate)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    Highcharts.chart('currentUdAmStatusCounter', {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Current Review Status'
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: vm.statusCounterDate
                        },
                        xAxis: {
                            categories: labels
                        },
                        yAxis: {
                            title: {
                                text: 'Count'
                            }
                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    inside: true,
                                    formatter: function () {
                                        return this.y !== 0 ? this.y : "";
                                    }
                                }
                            }
                        },
                        series: series
                    });
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

        getDateWiseData() {
            var vm = this;
            axios.get(vm.services.dateWiseUdAmReportUrl + "year=" + vm.reportYear + "&month=" + vm.reportMonth)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    this.buildLineChart('dateWiseData', 'line', 'Date wise UD and AM', vm.reportMonth + " " + vm.reportYear, 'Count', labels, series);
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

        getYearWiseData() {
            var vm = this;
            axios.get(vm.services.yearWiseUdAmReportUrl + "year=" + vm.filterYear)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    this.buildLineChart('yearWiseData', 'line', 'Year wise UD and AM', vm.filterYear, 'Count', labels, series);
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

        countTotalUdAm() {
            var vm = this;
            axios.get(vm.services.totalUdAmUrl)
                .then(response => {
                    Highcharts.chart('totalMemberChart', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'UD and AM'
                        },
                        credits: {
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                return this.point.name + ' ' + this.y;
                            }
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {y} ({point.percentage:.1f} %)'
                                }
                            }
                        },
                        series: [{
                            name: 'Member',
                            colorByPoint: true,
                            data: [{ name: response.data[0].ApplicationType, y: response.data[0].Count }, { name: response.data[1].ApplicationType, y: response.data[1].Count }]
                        }]
                    });
                });
        },

        getOperationYears() {
            var vm = this;
            axios.get(vm.services.operationYearsUrl)
                .then(response => {
                    vm.years = response.data;
                    vm.reportYear = vm.years[0];
                });
        }

    }
});

