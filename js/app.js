let holidays = [
  "1398/04/21",
  "1398/04/28",
  "1398/05/04",
  "1398/05/11",
  "1398/05/18",
  "1398/05/21",
  "1398/05/25",
  "1398/05/29",
  "1398/06/01",
  "1398/06/08",
  "1398/06/15",
  "1398/06/18",
  "1398/06/19",
  "1398/06/22",
  "1398/06/29",
  "1398/07/05",
  "1398/07/12",
  "1398/07/19",
  "1398/07/26",
  "1398/08/03",
  "1398/08/10",
  "1398/08/17",
  "1398/08/24",
  "1398/09/01",
  "1398/09/08",
  "1398/09/15",
  "1398/09/22",
  "1398/09/29",
  "1398/10/06",
  "1398/10/13",
  "1398/10/20",
  "1398/10/27",
  "1398/11/04",
  "1398/11/09",
  "1398/11/11",
  "1398/11/18",
  "1398/11/22",
  "1398/11/25",
  "1398/12/02",
  "1398/12/09",
  "1398/12/16",
  "1398/12/18",
  "1398/12/23",
  "1398/12/29",
];

let MESSAGE_TYPES = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
};

let INPUT_MODES = {
  NORMAL: "normal",
  PASTE: "paste",
};

let TABS = {
  INVOICES: "invoices",
  CHECKS: "checks",
};

persianDate.toLocale('en');

function getNumber(number) {
  if (/^[0-9]+$/.test(number)) {
    return number;
  }
  return null;
}

function getAmount(amount) {
  let amountWithoutDelimiter = amount.replace(/,|\//g, "");
  if (/^[0-9]+$/.test(amountWithoutDelimiter)) {
    return parseFloat(amountWithoutDelimiter);
  }
  return null;
}

function getFormattedAmount(number) {
  if (number === "") {
    return "";
  }
  return Number(`${number}`.replace(/\D/g, "")).toLocaleString();
}

function getPersianDate(date) {
  if (! /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/.test(date)) {
    return null;
  }
  let dateArray = date.split("/").map(i => parseInt(i));
  let actualDateArray = new persianDate(dateArray).toArray();
  if (dateArray[0] != actualDateArray[0] ||
    dateArray[1] != actualDateArray[1] ||
    dateArray[2] != actualDateArray[2]) {
      return null;
  }
  return new persianDate(dateArray);
}

function getFormattedPersianDate(date) {
  if (date == null) {
    return "";
  }
  return date.format("YYYY/MM/DD");
}

Vue.component('money-document-editor', {
  props: ['document'],
  template: '<div class="w-full flex items-center mb-2 flex-wrap text-center"><span class="w-1/12 print:hidden" v-on:click="$emit(\'delete\')"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="fill-current text-gray-500 cursor-pointer hover:text-gray-700 w-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></span>' + 
    '<div class="w-3/12 pr-2 flex-grow -mr-3 md:-mr-5"><input v-on:focus="$emit(\'focus\')" v-on:paste="$emit(\'paste\', $event, 0)" v-on:focus="$emit(\'add-new\')" v-on:keydown.enter="$emit(\'calculate\')" type="text" v-model="document.number" class="w-full"></div>' + 
    '<div class="px-2 w-4/12"><input v-on:focus="$emit(\'focus\')" v-on:paste="$emit(\'paste\', $event, 1)" v-on:focus="$emit(\'add-new\')" type="text" v-on:keydown.enter="$emit(\'calculate\')" v-model="document.date" class="w-full" :class="\'input-with-\' + document.getDateStatus().messageType"></div>' + 
    '<div class="w-4/12"><input v-on:focus="$emit(\'focus\')" v-on:paste="$emit(\'paste\', $event, 2)" type="text" v-model="document.formattedAmount" class="w-full" v-on:focus="$emit(\'add-new\')" v-on:keydown.enter="$emit(\'calculate\')" :class="\'input-with-\' + document.getAmountStatus().messageType"></div></div>',
  /*template: '<div class="w-full flex flex-wrap text-center">' + 
    '<div class="px-1 w-1/3"><input v-on:paste="$emit(\'paste\')" v-on:keydown.enter="$emit(\'calculate\')" type="text" v-model="document.number" class="w-full" v-on:paste="$emit(\'paste\', $event)"></div>' + 
    '<div class="px-1 w-1/3"><input v-on:paste="$emit(\'paste\')" type="text" v-on:keydown.enter="$emit(\'calculate\')" v-model="document.date" class="w-full" :class="{ \'input-with-error\': document.getDateStatus().messageType == MESSAGE_TYPES.ERROR, \'input-with-warning\': document.getDateStatus().messageType == MESSAGE_TYPES.WARNING, \'input-with-info\': document.getDateStatus().messageType == MESSAGE_TYPES.INFO }" v-on:paste="$emit(\'paste\', $event)"></div>' + 
    '<div class="px-1 w-1/3 mb-2"><input type="text" v-model="document.formattedAmount" class="w-full" v-on:keydown.tab="$emit(\'add-new\')" v-on:keydown.enter="$emit(\'calculate\')" placeholder="ریال" v-on:paste="$emit(\'paste\', $event)"></div></div>',*/
  watch: {
    document: {
      handler(newValue) {
        console.log(newValue);
        this.document.formattedAmount = getFormattedAmount(newValue.formattedAmount);
        if (this.document.formattedAmount != "") {
          this.document.amount = getAmount(this.document.formattedAmount);
        }
      },
      deep: true
    },
  },
});

let app = new Vue({
  el: "#app",
  data: {
    invoices: [],
    checks: [],
    result: "نامشخص",
    sumOfUnassignedInvoices: 0,
    sumOfUnassignedChecks: 0,
    invoicesInputMode: INPUT_MODES.NORMAL,
    checksInputMode: INPUT_MODES.NORMAL,
    selectedTab: TABS.INVOICES,
    isAboutModalVisible: false,
    isHelpModalVisible: false,
    isFocuedOnBothSides: false,
  },
  mounted: function() {
    this.addNewCheck();
    this.addNewInvoice();
  },
  computed: {
    sortedInvoices: function() {  
      this.invoices = this.sortDocuments(this.invoices);
      if (this.invoices.length == 0) {
        this.addNewInvoice();
      }
      return this.filterDocuments(this.invoices);
    },
    sortedChecks: function() {  
      this.checks = this.sortDocuments(this.checks);
      if (this.checks.length == 0) {
        this.addNewCheck();
      }
      return this.filterDocuments(this.checks);
    },
    formattedTotalAmountOfInvoices: function() {
      console.log(getFormattedAmount(0));
      return getFormattedAmount(this.getTotalAmountOfValidDocuments(this.invoices));
    },
    formattedTotalAmountOfChecks: function() {
      return getFormattedAmount(this.getTotalAmountOfValidDocuments(this.checks));
    },
  },
  methods: {
    calculate: function() {
      let invoicesIndex = 0;
      let checksIndex = 0;

      for (let i = 0; i < this.sortedInvoices.length; i++) {
        this.sortedInvoices[i].unassignedAmount = this.sortedInvoices[i].amount;
      }
      for (let i = 0; i < this.sortedChecks.length; i++) {
        this.sortedChecks[i].unassignedAmount = this.sortedChecks[i].amount;
        this.sortedChecks[i].sum = 0;
      }
      
      while (invoicesIndex < this.sortedInvoices.length && checksIndex < this.sortedChecks.length) {
        let invoiceDate = new persianDate(this.sortedInvoices[invoicesIndex].date.split("/").map(i => parseInt(i)));
        let invoiceDateString = invoiceDate.format("YYYY/MM/DD");
        let checkDate = new persianDate(this.sortedChecks[checksIndex].date.split("/").map(i => parseInt(i)));
        let checkDateString = checkDate.format("YYYY/MM/DD");
        console.log("Invoice date: " + invoiceDateString + ", Check date: " + checkDateString);
        if (invoiceDateString > checkDateString) {
          checkDate = new persianDate();
          console.log("Switched to present day!");
        }
        let daysInBetween = invoiceDate.diff(checkDate, 'days');
        console.log("Days in between: " + daysInBetween);
        console.log("Invoice " + invoicesIndex + ": " + this.sortedInvoices[invoicesIndex].unassignedAmount);
        console.log("Check " + checksIndex + ": " + this.sortedChecks[checksIndex].unassignedAmount);
        if (this.sortedInvoices[invoicesIndex].unassignedAmount < this.sortedChecks[checksIndex].unassignedAmount) {
          console.log(this.sortedInvoices[invoicesIndex].unassignedAmount + " is taken from check " + checksIndex + 
           " and invoice " + invoicesIndex + " is fully assigned");
          this.sortedChecks[checksIndex].unassignedAmount -= this.sortedInvoices[invoicesIndex].unassignedAmount;
          this.sortedChecks[checksIndex].sum += (this.sortedInvoices[invoicesIndex].unassignedAmount * daysInBetween);
          this.sortedInvoices[invoicesIndex].unassignedAmount = 0;
          invoicesIndex++;
        } else if (this.sortedInvoices[invoicesIndex].unassignedAmount > this.sortedChecks[checksIndex].unassignedAmount) {
          console.log(this.sortedChecks[checksIndex].unassignedAmount + " is taken from check " + checksIndex + 
           " and check " + checksIndex + " is fully assigned");
          this.sortedInvoices[invoicesIndex].unassignedAmount -= this.sortedChecks[checksIndex].unassignedAmount;
          this.sortedChecks[checksIndex].sum += (this.sortedChecks[checksIndex].unassignedAmount * daysInBetween);
          this.sortedChecks[checksIndex].unassignedAmount = 0;
          checksIndex++;
        } else {
          console.log("Both check " + checksIndex + " and invoice " + invoicesIndex + " are fully assigned");
          this.sortedChecks[checksIndex].sum += (this.sortedChecks[checksIndex].unassignedAmount * daysInBetween);
          this.sortedInvoices[invoicesIndex].unassignedAmount = 0;
          this.sortedChecks[checksIndex].unassignedAmount = 0;
          checksIndex++;
          invoicesIndex++;
        }
      }
      console.log(checksIndex, this.sortedChecks.length, invoicesIndex, this.sortedInvoices.length);
      this.sumOfUnassignedChecks = 0;
      this.sumOfUnassignedInvoices = 0;
      for (let i = checksIndex; i < this.sortedChecks.length; i++) {
        this.sumOfUnassignedChecks += this.sortedChecks[i].unassignedAmount;
      }
      for (let i = invoicesIndex; i < this.sortedInvoices.length; i++) {
        this.sumOfUnassignedInvoices += this.sortedInvoices[i].unassignedAmount;
      }
      console.log("Here");
      let sum = 0;
      for (let i = 0; i < this.sortedChecks.length; i++) {
        this.sortedChecks[i].result = this.sortedChecks[i].sum / this.sortedChecks[i].amount;
        sum += this.sortedChecks[i].result;
        console.log(this.sortedChecks[i].result);
      }

      this.result = (sum / this.sortedChecks.length).toFixed(2);
    },
    pasteChecks: function(checks) {
      if (checks.length > 0) {
        for (let i = this.checks.length - 1; i >= 0; i--) {
          if (this.checks[i].isEmpty()) {
            this.checks.pop();
          } else {
            break;
          }
        }
      }
      for (let i = 0; i < checks.length; i++) {
        this.addNewCheck(checks[i]);
      }
      this.$nextTick(() => {
        let index = this.checks.length - 1;
        let input = this.$refs.check[index];
        input.$el.querySelector("input").focus();
      });
    },
    pasteInvoices: function(invoices) {
      if (invoices.length > 0) {
        for (let i = this.invoices.length - 1; i >= 0; i--) {
          if (this.invoices[i].isEmpty()) {
            this.invoices.pop();
          } else {
            break;
          }
        }
      }
      for (let i = 0; i < invoices.length; i++) {
        this.addNewInvoice(invoices[i]);
      }
      this.$nextTick(() => {
        let index = this.invoices.length - 1;
        let input = this.$refs.invoice[index];
        input.$el.querySelector("input").focus();
      });
    },
    paste: function(event, column) {
      let element = event.target;
      let documentType = this.selectedTab;
      let pastedData = (event.clipboardData || window.clipboardData).getData('text');

      let invoices = [];
      let checks = [];

      //let rowsData = pastedData;
      let rows = pastedData.split(/\r\n|\n|\r/);
      console.log(rows);
      if (rows.length > 1) {
        console.log("prevented");
        event.preventDefault();
      } else {
        console.log(rows[0].indexOf("\t"));
        if (rows.length == 0) {
          return;
        } else if (rows[0].indexOf("\t") == -1) {
          return;
        } else {
          console.log("prevented");
          event.preventDefault();
        }
      }

      console.log(rows.length + " rows");
      console.log("Rows: " + rows);
      for (let row of rows) {
        console.log(row.charCodeAt(0));
        if (row == "") {
          continue;
        }
        console.log("Row: " + row);
        var columns = row.split(/\t/);
        console.log(row.charAt(0));
        console.log(columns);
        console.log(columns.length + " columns");
        console.log("\tColumns: " + columns);
        /*if (columns.length != 3) {
          console.log("Invalid number of columns!");
          continue;
        }
        if (columns[1] == "" || columns[2] == "") {
          console.log("Empty date or amount!");
          continue;
        }*/
        let firstDocument = this.getDefaultDocument();
        if (column == 0) {
          console.log("First Col");
          if (columns.length > 0) {
            console.log(columns[0]);
            firstDocument.number = getNumber(columns[0]);
          }
          if (columns.length > 1) {
            firstDocument.date = columns[1];
          }
          if (columns.length > 2) {
            firstDocument.formattedAmount = getFormattedAmount(columns[2]);
            firstDocument.amount = getAmount(firstDocument.formattedAmount);
          }
        } else if (column == 1) {
          if (columns.length > 0) {
            firstDocument.date = columns[0];
          }
          if (columns.length > 1) {
            firstDocument.formattedAmount = getFormattedAmount(columns[1]);
            firstDocument.amount = getAmount(firstDocument.formattedAmount);
          }
        } else if (column == 2) {
          if (columns.length > 0) {
            firstDocument.formattedAmount = getFormattedAmount(columns[0]);
            firstDocument.amount = getAmount(firstDocument.formattedAmount);
          }
        }

        if (documentType == TABS.INVOICES) {
          console.log(firstDocument);
          invoices.push(firstDocument);
        } else if (documentType == TABS.CHECKS) {
          checks.push(firstDocument);
        }
      }
      if (invoices.length > 0) {
        this.pasteInvoices(invoices);
      }
      if (checks.length > 0) {
        this.pasteChecks(checks);
      }
    },
    sortDocuments: function(documents) {
      return documents.sort((a, b) => {
        if (a.amount == 0) {
          return 1;
        }
        if (a.date < b.date)
          return -1;
        if (a.date > b.date)
          return 1;
        return 0;
      }).filter((value, index) => {
        return !value.isEmpty();
      });
    },
    filterDocuments: function(documents) {
      return documents.filter((value, index) => {
        return value.isValid();
      });
    },
    getTotalAmountOfValidDocuments: function(documents) {
      let sum = 0;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].isValid()) {
          sum += parseFloat(documents[i].amount);
        }
      }
      return sum;
    },
    addNewInvoice: function(data = null) {
      let invoice = this.getDefaultDocument();
      invoice = Object.assign(invoice, data);
      invoice.getDateStatus = function() {
        let result = { isValid: true };
        let status = getPersianDate(this.date);
        if (status === null) {
          result.messageContent = "تاریخ، معتبر نیست!";
          result.messageType = MESSAGE_TYPES.ERROR;
          result.isValid = false;
        }
        return result;
      };
      this.invoices.push(invoice);
    },
    addNewCheck: function(data = null) {
      let check = this.getDefaultDocument();
      check = Object.assign(check, data);
      check.getDateStatus = function() {
        let result = { isValid: true };
        let status = getPersianDate(this.date);
        if (status === null) {
          result.messageContent = "تاریخ، معتبر نیست!";
          result.messageType = MESSAGE_TYPES.ERROR;
          result.isValid = false;
        } else if (status.day() == 7) {
          result.messageContent = "روز انتخابی، جمعه است!";
          result.messageType = MESSAGE_TYPES.WARNING;
          result.isValid = true;
        } else {
          for (let i = 0; i < holidays.length; i++) {
            if (holidays[i] == status.format("YYYY/MM/DD")) {
              result.messageContent = "روز انتخابی، تعطیل است!";
              result.messageType = MESSAGE_TYPES.WARNING;
              result.isValid = true;
              break;
            }
          }
        }
        return result;
      };
      this.checks.push(check);
    },
    deleteInvoice: function(index) {
      if (this.invoices.length == 1 && index == 0) {
        if (this.invoices[index].isEmpty()) {
          return;
        } else {
          this.invoices.pop();
          this.addNewInvoice();
        }
      } else {
        this.invoices.splice(index, 1);
      }
    },
    deleteCheck: function(index) {
      if (this.checks.length == 1 && index == 0) {
        if (this.checks[index].isEmpty()) {
          return;
        } else {
          this.checks.pop();
          this.addNewCheck();
        }
      } else {
        this.checks.splice(index, 1);
      }
    },
    getDefaultDocument: function() {
      return {
        date: "",
        number: "",
        formattedAmount: "",
        amount: 0,
        isValid: function() {
          return !Number.isNaN(parseFloat(this.amount)) && this.formattedAmount != "" && this.getDateStatus().isValid;
        },
        getAmountStatus: function() {
          let result = { isValid: true };
          if (this.formattedAmount === "") {
            result.messageContent = "مبلغ، الزامی است!";
            result.messageType = MESSAGE_TYPES.ERROR;
            result.isValid = false;
          }
          return result;
        },
        isEmpty: function() {
          if ((this.date === "" || this.date === null) &&
            (this.number === "" || this.number === null) &&
            (this.formattedAmount === "" || this.formattedAmount === null)) {
            return true;
          }
          return false;
        },
      };
    },
    changeTab: function(tab) {
      this.selectedTab = tab;
    },
  },
});