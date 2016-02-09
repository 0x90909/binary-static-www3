BetAnalysis.DigitInfoWS = function() {
    this.chart_config = {
        chart: {
                renderTo:'last_digit_histo',
                defaultSeriesType:'column',
                backgroundColor:'#eee',
                borderWidth:1,
                borderColor:'#ccc',
                plotBackgroundColor:'#fff',
                plotBorderWidth:1,
                plotBorderColor:'#ccc',
                height:225 // This is "unresponsive", but so is leaving it empty where it goes to 400px.
        },
        title:{text:''},
        credits:{enabled:false},
        exporting:{enabled:false},
        legend:{
            enabled:false
        },
        tooltip:{
            borderWidth:1,
            formatter:function() {
                var that = this;
                var total = $("select[name='tick_count']").val();
                var percentage = that.y/total*100;
                return '<b>Digit:</b> '+ that.x +'<br/>'+
                '<b>Percentage:</b> '+ percentage.toFixed(1) + " %";
            }
        },
        plotOptions:{
            column:{
                shadow:false,
                borderWidth:0.5,
                borderColor:'#666',
                pointPadding:0,
                groupPadding:0,
                color: '#e1f0fb',
            },
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        var total = $("select[name='tick_count']").val();
                        var percentage = this.point.y/total*100;
                        return percentage.toFixed(2) + ' %';
                    },
                },
            },
        },
        xAxis:{
            categories: ['0','1','2','3','4','5','6','7','8','9'],
            lineWidth:0,
            lineColor:'#999',
            tickLength:10,
            tickColor:'#ccc',
        },
        yAxis:{
            title:{text:''},
            maxPadding:0,
            gridLineColor:'#e9e9e9',
            tickWidth:1,
            tickLength:3,
            tickColor:'#ccc',
            lineColor:'#ccc',
            endOnTick:true,
            opposite: false,
            labels: {
                align: 'left',
                x: 0,
                enabled: false,
                formatter: function() {
                    var total = $("select[name='tick_count']").val();
                    var percentage = parseInt(this.value/total*100);
                    return percentage + " %";
                },
            },
        },
    };

    this.spots = [];
    this.stream_id = null;
};

BetAnalysis.DigitInfoWS.prototype = {
    add_content: function(){
        var contentId = document.getElementById('tab_last_digit-content'),
            content = text.localize('<div class="grd-parent">'+
                        '<div id="last_digit_histo_form" class="grd-grid-8 grd-grid-mobile-12 grd-centered">'+
                        '<form class=smallfont action="https://www.binaryqa23.com/trade/last_digit_info?l=EN" method="post">'+
                        '<div class="grd-grid-mobile-12">Select market : <select class="smallfont" name="underlying"><option value="R_100">Random 100 Index</option><option value="R_25">Random 25 Index</option><option value="R_50">Random 50 Index</option><option value="R_75">Random 75 Index</option><option value="RDBEAR">Random Bear</option><option value="RDBULL">Random Bull</option><option selected="selected" value="RDMARS">Random Mars</option><option value="RDMOON">Random Moon</option><option value="RDSUN">Random Sun</option><option value="RDVENUS">Random Venus</option><option value="RDYANG">Random Yang</option><option value="RDYIN">Random Yin</option></select></div>'+
                        '<div class="grd-grid-mobile-12">Number of ticks : <select class="smallfont" name="tick_count"><option value="25">25</option><option value="50">50</option><option selected="selected" value="100">100</option><option value="500">500</option><option value="1000">1000</option></select></div>'+
                        '</form>'+
                        '</div>'+
                        '<div id="last_digit_histo" class="grd-grid-8 grd-grid-mobile-12 grd-centered"></div>'+
                        '<div id="last_digit_title" class="grd-hide">Binaryqa23.com - Last digits for the latest %1 ticks on %2</div>'+
                        '</div>');
        contentId.innerHTML = content;
        $('[name=underlying]').val($('#underlying option:selected').val());
        
    },
    on_latest: function() {
        var that = this;
        var tab = $('#tab_last_digit-content');
        var form = tab.find('form:first');
        form.on('submit', function(event) {
            event.preventDefault();
            return false;
        }).addClass('unbind_later');

        var get_latest = function() {
            var request = JSON.parse('{"ticks_history":"'+ $('[name=underlying] option:selected').val() +'",'+
                                        '"end": "latest",'+
                                        '"count": '+ $('[name=tick_count]', form).val() +','+
                                        '"req_id": 2}');
            if($('#underlying option:selected').val() != $('[name=underlying]', form).val()){
                request['subscribe']=1;
            }
            if(that.stream_id != null){
                BinarySocket.send(JSON.parse('{"forget": "'+ that.stream_id +'"}'));
                that.stream_id = null;
            }
            BinarySocket.send(request);
        };
        $('[name=underlying]', form).on('change',  get_latest ).addClass('unbind_later');
        $('[name=tick_count]', form).on('change',  get_latest ).addClass('unbind_later');
    },
    show_chart: function(underlying, spots) {
        this.chart_config.xAxis.title = {
            text: $('#last_digit_title').html().replace('%2', $('[name=underlying] option:selected').text()).replace('%1',spots.length),
        };
        var dec = spots[0].split('.')[1].length;
        for(i=0;i<spots.length;i++){
            var val = parseFloat(spots[i]).toFixed(dec);
            spots[i]=val.substr(val.length-1);
        }
        this.spots = spots;
        this.chart = new Highcharts.Chart(this.chart_config);
        this.chart.addSeries({name : underlying, data: []});

        this.update();
    },
    update: function(symbol, latest_spot) {
        if(typeof this.chart === "undefined") {
            return;
        }

        var series = this.chart.series[0]; // Where we put the final data.
        if (series.name != symbol) {
            latest_spot = undefined; // This simplifies the logic a bit later.
        }

        if (typeof latest_spot !== "undefined") { // This is a bit later. :D
            this.spots.unshift(latest_spot.slice(-1)); // Only last digit matters
            this.spots.pop();
        }

        // Always recompute and draw, even if theres no new data.
        // This is especially useful on first reuqest, but maybe in other ways.
        var filtered_spots = [];
        var digit = 10,
            filterFunc = function (el) { return el == digit; };
        var min_max_counter = [];
        while(digit--) {
            var val = this.spots.filter(filterFunc).length;
            filtered_spots[digit] = val;
            if (typeof min_max_counter[val] === 'undefined') {
                min_max_counter[val] = 0;
            }
            min_max_counter[val]++;
        }
        var min = Math.min.apply(null, filtered_spots);
        var max = Math.max.apply(null, filtered_spots);
        var min_index = filtered_spots.indexOf(min);
        var max_index = filtered_spots.indexOf(max);
        // changing color
        if (min_max_counter[min] === 1) {
            filtered_spots[min_index] = {y: min, color: '#CC0000'};
        }

        if (min_max_counter[max] === 1) {
            filtered_spots[max_index] = {y: max, color: '#2E8836'};
        }
        return series.setData(filtered_spots);
    },
    show_tab: function() {
        var tab_last_digit = $('#tab_last_digit');
        MenuContent.show_tab(tab_last_digit);
        var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
        if(saved_anaysis_tab == 'tab_last_digit') {
            MenuContent.trigger({
                'tab_id': saved_anaysis_tab
            });
        }
    },
    hide_tab: function() {
        var tab_last_digit = $('#tab_last_digit');
        MenuContent.hide_tab(tab_last_digit);
        if(typeof this.chart !== "undefined") {
            this.chart.destroy();
        }
        this.chart = undefined;
        this.spots = [];
    },
    update_chart: function(tick){
        if(tick.req_id === 2){
            this.stream_id = tick.tick.id;
            this.update(tick.tick.symbol, tick.tick.quote);
        } else{
            if(!this.stream_id){
                this.update(tick.tick.symbol, tick.tick.quote);
            }
        }
        
    }
};

BetAnalysis.tab_last_digitws = new BetAnalysis.DigitInfoWS();
