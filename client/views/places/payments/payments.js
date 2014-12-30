Template.paymentsPlace.helpers({
  payments: function () {
    if (_.contains(this.owner, Meteor.userId())) {
      return Payments.find({},{sort: {date: -1}}).fetch();
    }
  },
  bigTotal: function () {
    var bigTotal = 0;
    if (_.contains(this.owner, Meteor.userId())) {
      Payments.find({}).map(function(doc) {
        bigTotal += doc.total;
      });
    }
    return bigTotal;
  },
  chart: function (){

    var byday={};
    function groupday(value, index, array)
    {
      // console.log(value.date);
      d = new Date(value.date);
      d = Math.floor(d.getTime()/(1000*60*60*24));
      var label = moment(value.date).format('L');
      var dayTotal = 0;
      byday[d]=byday[d]||[];
      dayTotal = (byday[d].value || 0) + value.total;
      byday[d].label=label;
      byday[d].value=dayTotal;

    }

    if (_.contains(this.owner, Meteor.userId())) {
      var payments = Payments.find({},{sort: {date: -1}}).fetch();
      // console.log(payments);
      payments.map(groupday);
      // console.log(byday);
      if (byday) {

        var cleanValues = [];
        $.each(byday, function(index, value){
          cleanValues.push(value);
        });

        var chartData = [{key: "Cumulative Return", values: cleanValues}];
        // console.log(chartData);

        nv.addGraph(function() {
          var chart = nv.models.discreteBarChart()
          .x(function(d) { return d.label; })
          .y(function(d) { return d.value; })
          .staggerLabels(true)
          .tooltips(false)
          .showValues(true)
          .duration(250)
          ;
          d3.select('#chart svg')
          .datum(chartData)
          .call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        });
      }
    }
  }
});
