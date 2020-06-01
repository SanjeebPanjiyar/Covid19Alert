import Vue from "vue";
import axios from "axios";
import Highcharts from "highcharts";
import Highstock from "highcharts/highstock";
import exportingInit from 'highcharts/modules/exporting';

Vue.component("admin-ud-report", {
    data() {
        return {
            errors: null,
            services: {
                operationYearsUrl: "/api/UDReports/operationYear",
                allUdAmCountUrl: "/api/UDReports/all",
                // totalUdAmUrl: "/api/UDReports/totalUdAm",
                reviewUrl: "/api/UDReports/review?",
                memberCounterUrl: "/api/UDReports/member",
                statusCounterUrl: "/api/UDReports/status?date=",
                serviceChargeCalculateUrl: "/api/UDReports/serviceCharge?",
                yearWiseUdAmReportUrl: "/api/UDReports/year?",
                dateWiseUdAmReportUrl: "/api/UDReports/month?",
                allUdAmCountReportUrl: "/api/UDReports/MemberUdAm?" //"/api/UDReports/allMemberUdAMCount?"
            },
            years: [],
            reportYear: new Date().getFullYear(),
            statusCounterDate: new Date().toISOString().slice(0, 10),
            reportMonths: [],
            reportMonth: new Date().toLocaleString('default', { month: 'long' }),
            totalMember: 0,
            totalUdAm: [],
            filterYear: '',
            take: 10,
            memberwiseUdAmFilterYear: '',
            memberwiseUdAmFilterMonth: ''
        };
    },

    created() {

    },

    mounted() {

        exportingInit(Highcharts);
        exportingInit(Highstock);

        for (var m = 1; m < 13; m++) {
            this.reportMonths.push(new Date('2000-' + m + '-01').toLocaleString('default', { month: 'long' }));
        }
        this.getAllUdAm();
        this.countTotalMember();
        this.getOperationYears();
        this.countProcessedReviews();
        this.countCurrentUdAmStatus();
        this.calculateServiceCharge();
        this.getDateWiseUdAm();
        this.getYearWiseUdAm();
        this.getMemberwiseUdAmCount();
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
                credits: {
                    enabled: false
                },
                subtitle: {
                    text: subtitle
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

        countProcessedReviews() {
            var vm = this;
            axios.get(vm.services.reviewUrl + "year=" + vm.reportYear + "&month=" + vm.reportMonth)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    //this.buildLineChart('processedReviewCounter', 'line', 'Individual Review Status', '', 'Count', labels, series);
                    Highcharts.chart('processedReviewCounter', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Individual Review Status'
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: vm.reportMonth + ' ' + vm.reportYear
                        },
                        xAxis: {
                            categories: labels,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Count'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                               pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
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

        getYearWiseUdAm() {
            var vm = this;
            axios.get(vm.services.yearWiseUdAmReportUrl + "year=" + vm.filterYear)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    this.buildLineChart('yearWiseUdAm', 'line', 'Month/Year UD and AM Report', vm.filterYear, 'Count', labels, series);
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

        getDateWiseUdAm() {
            var vm = this;
            axios.get(vm.services.dateWiseUdAmReportUrl + "year=" + vm.reportYear + "&month=" + vm.reportMonth)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    this.buildLineChart('dateWiseUdAm', 'line', 'UD and AM Report', vm.reportMonth + " " + vm.reportYear, 'Count', labels, series);
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

        calculateServiceCharge() {
            var vm = this;
            axios.get(vm.services.serviceChargeCalculateUrl + "year=" + vm.reportYear + "&month=" + vm.reportMonth)
                .then(response => {
                    var labels = Object.keys(response.data[0].Data);
                    var series = [];
                    for (var i = 0; i < response.data.length; i++) {
                        series.push({ name: response.data[i].ApplicationType, data: Object.values(response.data[i].Data) });
                    }
                    //this.buildLineChart('serviceChargeCollection', 'column', 'Service Charge Collection', vm.reportMonth + " " + vm.reportYear, 'Count', labels, series);
                     Highcharts.chart('serviceChargeCollection', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Service Charge Collection'
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: vm.reportMonth + ' ' + vm.reportYear
                        },
                        xAxis: {
                            categories: labels,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Amount'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
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

        countTotalMember() {
            var vm = this;
            axios.get(vm.services.memberCounterUrl)
                .then(response => {
                    Highcharts.chart('totalMemberChart', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Zone wise Members'
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
                            //data: [{ name: response.data[0].Key, y: response.data[0].Count }, { name: response.data[1].Key, y: response.data[1].Count }]
                            data: response.data
                        }]
                    });
                });
        },

        getOperationYears() {
            var vm = this;
            axios.get(vm.services.operationYearsUrl)
                .then(response => {
                    vm.years = response.data;
                });
        },

        getAllUdAm() {
            var vm = this;
            axios.get(vm.services.allUdAmCountUrl)
                .then(response => {
                    var colors = Highcharts.getOptions().colors;
                    var label = Object.keys(response.data[0].Data);
                    var categories = [
                        response.data[0].ApplicationType,
                        response.data[1].ApplicationType
                    ],
                        data = [
                            {
                                y: 50,
                                color: colors[2],
                                drilldown: {
                                    name: response.data[0].ApplicationType,
                                    categories: label,
                                    data: Object.values(response.data[0].Data)
                                }
                            },
                            {
                                y: 50,
                                color: colors[1],
                                drilldown: {
                                    name: response.data[1].ApplicationType,
                                    categories: label,
                                    data: Object.values(response.data[1].Data)
                                }
                            }
                        ],
                        browserData = [],
                        versionsData = [],
                        i,
                        j,
                        dataLen = data.length,
                        drillDataLen,
                        brightness;

                    // Build the data arrays
                    for (i = 0; i < dataLen; i += 1) {

                        // add browser data
                        browserData.push({
                            name: categories[i],
                            y: data[i].y,
                            color: data[i].color
                        });

                        // add version data
                        drillDataLen = data[i].drilldown.data.length;
                        for (j = 0; j < drillDataLen; j += 1) {
                            //brightness = 0.2 - (j / drillDataLen) / 5;
                            versionsData.push({
                                name: data[i].drilldown.categories[j],
                                y: data[i].drilldown.data[j],
                                //color: Highcharts.color(data[i].color).brighten(brightness).get()
                                color: data[i].color
                            });
                        }
                    }

                    // Create the chart
                    Highcharts.chart('zoneWiseUdAmCount', {
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: 'Zone wise UD and AM'
                        },
                        subtitle: {
                            text: ''
                        },
                        plotOptions: {
                            pie: {
                                shadow: false,
                                center: ['50%', '50%']
                            }
                        },
                        tooltip: {
                            //valueSuffix: '%',
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: response.data[0].ApplicationType,
                            data: browserData,
                            size: '60%',
                            dataLabels: {
                                formatter: function () {
                                    return this.y > 5 ? this.point.name : null;
                                },
                                //color: '#ffffff',
                                distance: -30
                            }
                        },
                        {
                            name: response.data[1].ApplicationType,
                            data: versionsData,
                            size: '80%',
                            innerSize: '60%',
                            dataLabels: {
                                formatter: function () {
                                    // display only if larger than 1
                                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                                        this.y : null;
                                }
                            },
                            id: 'versions'
                        }],
                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 400
                                },
                                chartOptions: {
                                    series: [{
                                    }, {
                                        id: 'versions',
                                        dataLabels: {
                                            enabled: false
                                        }
                                    }]
                                }
                            }]
                        }
                    });
                });
        },

        getMemberwiseUdAmCount() {
            var vm = this;
            if (vm.memberwiseUdAmFilterMonth && !vm.memberwiseUdAmFilterYear) {
                //vm.memberwiseUdAmFilterYear = new Date().getFullYear();
                vm.$bvModal.msgBoxOk("Please select year.", {
                    okVariant: "danger",
                    centered: true,
                    hideHeaderClose: false,
                    size: 'sm',
                    footerClass: "p-2"
                });
                return;
            }

            axios.get(vm.services.allUdAmCountReportUrl + "year=" + vm.memberwiseUdAmFilterYear + "&month=" + vm.memberwiseUdAmFilterMonth + "&take=" + vm.take)
                .then(response => {
                    var categoires = [];
                    var series = [{ name: "UD", data: [] }, { name: "AM", data: [] }];
                    response.data.forEach((d, i) => {
                        // categoires.push(d.FactoryName + ' (' + (i + 1) + ')' + ' (UD: ' + d.Data.UD + ' AM: ' + d.Data.AM + ')');
                        categoires.push(d.FactoryName + ' (' + (i + 1) + ')');
                        series[0].data.push(d.Data.UD);
                        series[1].data.push(d.Data.AM);
                    });
                    //console.log(categoires);
                    //console.log(series);
                    Highstock.chart('alludamcountdiv', {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Top ' + vm.take + ' Members UD/AM (Passed & Dispatched)'
                        },
                        subtitle: {
                            text: vm.memberwiseUdAmFilterMonth + " " + vm.memberwiseUdAmFilterYear
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            categories: categoires,
                            title: {
                                text: null
                            },
                            scrollbar: {
                                enabled: true
                            },
                            tickLength: 0,
                            min: 0,
                            max: 9
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

        filterAll() {
            this.filterYear = this.reportYear;
            this.memberwiseUdAmFilterYear = this.reportYear;
            this.memberwiseUdAmFilterMonth = this.reportMonth;
            this.countProcessedReviews();
            this.countCurrentUdAmStatus();
            this.calculateServiceCharge();
            this.getDateWiseUdAm();
            this.getYearWiseUdAm();
            this.getMemberwiseUdAmCount();
        }
    }
});

