let v = new Vue({
  el: "#app",
  data: {
    invoices: [],
    checks: [],
    newInvoice: {
      date: "",
      number: "",
      amount: 0,
    },
    newCheck: {
      date: "",
      number: "",
      amount: 0,
    },
    result: null,
  },
  computed: {
    sortedInvoices: function() {  
      return this.invoices.sort((a, b) => {
        if (a.date < b.date)
          return -1;
        if (a.date > b.date)
          return 1;
        return 0;
      });
    },
    sortedChecks: function() {  
      return this.checks.sort((a, b) => {
        if (a.date < b.date)
          return -1;
        if (a.date > b.date)
          return 1;
        return 0;
      });
    },
    totalAmountOfInvoices: function() {
      let sum = 0;
      for (let i = 0; i < this.invoices.length; i++) {
        sum += parseFloat(this.invoices[i].amount);
      }
      return sum;
    },
    totalAmountOfChecks: function() {
      let sum = 0;
      for (let i = 0; i < this.checks.length; i++) {
        sum += parseFloat(this.checks[i].amount);
      }
      return sum;
    },
  },
  methods: {
    addNewInvoice: function() {
      let dateArray = this.newInvoice.date.split("/").map(i => parseInt(i));
      let actualDateArray = new persianDate(dateArray).toArray();
      if (dateArray[0] != actualDateArray[0] ||
        dateArray[1] != actualDateArray[1] ||
        dateArray[2] != actualDateArray[2]) {
          this.newInvoice.date = new persianDate(dateArray).format("YYYY/MM/DD");
          return;
      }
      this.newInvoice.unassignedAmount = parseFloat(this.newInvoice.amount);
      this.invoices.push(this.newInvoice);
      this.newInvoice = { date: "", number: "", amount: 0 };
    },
    addNewCheck: function() {
      let dateArray = this.newCheck.date.split("/").map(i => parseInt(i));
      let actualDateArray = new persianDate(dateArray).toArray();
      if (dateArray[0] != actualDateArray[0] ||
        dateArray[1] != actualDateArray[1] ||
        dateArray[2] != actualDateArray[2]) {
          this.newCheck.date = new persianDate(dateArray).format("YYYY/MM/DD");
          return;
      }
      this.newCheck.unassignedAmount = parseFloat(this.newCheck.amount);
      this.newCheck.sum = 0;
      this.checks.push(this.newCheck);
      this.newCheck = { date: "", number: "", amount: 0 };
    },
    calculate: function() {
      let invoicesIndex = 0;
      let checksIndex = 0;

      while (invoicesIndex < this.sortedInvoices.length && checksIndex < this.sortedChecks.length) {
        var a = new persianDate(this.sortedInvoices[invoicesIndex].date.split("/").map(i => parseInt(i)));
        var b = new persianDate(this.sortedChecks[checksIndex].date.split("/").map(i => parseInt(i)));
        let daysInBetween = a.diff(b, 'days') + 1;
        console.log(daysInBetween);
        if (this.sortedInvoices[invoicesIndex].unassignedAmount < this.sortedChecks[checksIndex].unassignedAmount) {
          console.log("here");
          this.sortedChecks[checksIndex].unassignedAmount -= this.sortedInvoices[invoicesIndex].unassignedAmount;
          this.sortedChecks[checksIndex].sum += (this.sortedInvoices[invoicesIndex].unassignedAmount * daysInBetween);
          console.log(this.sortedChecks[checksIndex].unassignedAmount);
          this.sortedInvoices[invoicesIndex].unassignedAmount = 0;
          console.log("here");
          invoicesIndex++;
        } else if (this.sortedInvoices[invoicesIndex].unassignedAmount > this.sortedChecks[checksIndex].unassignedAmount) {
          console.log("here2");
          this.sortedInvoices[invoicesIndex].unassignedAmount -= this.sortedChecks[checksIndex].unassignedAmount;
          this.sortedChecks[checksIndex].sum += (this.sortedChecks[checksIndex].unassignedAmount * daysInBetween);
          this.sortedChecks[checksIndex].unassignedAmount = 0;
          checksIndex++;
        } else {
          console.log("here3");
          this.sortedChecks[checksIndex].sum += (this.sortedChecks[checksIndex].unassignedAmount * daysInBetween);
          this.sortedInvoices[invoicesIndex].unassignedAmount = 0;
          this.sortedChecks[checksIndex].unassignedAmount = 0;
          checksIndex++;
          invoicesIndex++;
        }
      }
      let sum = 0;
      for (let i = 0; i < this.sortedChecks.length; i++) {
        this.sortedChecks[i].result = this.sortedChecks[i].sum / this.sortedChecks[i].amount;
        sum += this.sortedChecks[i].result;
        console.log(this.sortedChecks[i].result);
      }

      this.result = sum / this.sortedChecks.length;
    },
    reset: function() {
      this.newInvoice = { date: "", number: "", amount: 0 };
      this.newCheck = { date: "", number: "", amount: 0 };
      this.invoices = [];
      this.checks = [];
      this.result = null;
    },
  },
});