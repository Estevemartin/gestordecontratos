
  console.log("Printing KPIs")

  const User = require('.../models/user-model');
  const Contract = require('.../models/contract-model');


  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  document.getElementById('toDate').value = today;
  console.log(today)
  console.log(document.getElementById('toDate'))

  //Warnings Required Chart
  var warningsRequiredElement = document.getElementById('warningsRequired');
  var warningsRequired = new Chart(warningsRequiredElement, {
      type: 'bar',
      data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: '1st Warning',
            data: [4, 4, 2],
            backgroundColor: [
                'rgba(113, 236, 133, 0.2)',
                'rgba(113, 236, 133, 0.2)',
                'rgba(113, 236, 133, 0.2)'
                
            ],
            borderColor: [
                'rgba(113, 236, 133, 1)',
                'rgba(113, 236, 133, 1)',
                'rgba(113, 236, 133, 1)',
            ],
            borderWidth: 1
          },
          {
            label: '2nd Warning',
            data: [2, 1, 2],
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          },
          {
            label: '3rd Warning or more',
            data: [2, 2, 4],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
          }]
      },
       options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }
  
  }); 
  
  //Contracts Managed in more or less than 6 days
  var sixWarnings = document.getElementById('sixWarnings');
  var sixWarningsChart = new Chart(sixWarnings, {
      type: 'bar',
      data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: 'Managed in less than 6 days',
            data: [4, 4, 2],
            backgroundColor: [
                'rgba(113, 236, 133, 0.2)',
                'rgba(113, 236, 133, 0.2)',
                'rgba(113, 236, 133, 0.2)'
                
            ],
            borderColor: [
                'rgba(113, 236, 133, 1)',
                'rgba(113, 236, 133, 1)',
                'rgba(113, 236, 133, 1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Managed in more than 6 days',
            data: [2, 2, 4],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
          }]
      },
       options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
       
    }
  
  }); 
  
  //Average response days
  var averageResponseDays = document.getElementById('averageResponseDays');
  var averageResponseDays = new Chart(averageResponseDays, {
      type: 'line',
      data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
          
          {
            label: 'Managed in more than 6 days',
            data: [6,6,6,6,6,6,6,6,6,6,6,6],
            backgroundColor:'transparent',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 2
          },
          {
            label: 'Managed in more than 6 days',
            data: [6,6,6,6,6,6,6,6,6,6,6,6],
            backgroundColor:'transparent',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 2
          },
          {
            label: 'Managed in more than 6 days',
            data: [6,6,6,6,6,6,6,6,6,6,6,6],
            backgroundColor:'transparent',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 2
          },
        
          
          
          {
            label: 'Managed in less than 6 days',
            data: [3,3,3,3,3,3,3,3,3,3,3,3],
            backgroundColor:'transparent',
            borderColor: 'rgba(113, 236, 133, 1)',
            pointradius:'0px',
            borderWidth: 2
          },
          {
            label: 'Managed in more than 6 days',
            data: [6,6,6,6,6,6,6,6,6,6,6,6],
            backgroundColor:'transparent',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 2
          }]
      },
       options: {
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
            }
          }]
        },
        elements: {
          point:{
              radius: 0
          }
        },
        legend: {
            labels: {
                filter: function(item, chart) {
                    return !item.text.includes('Managed in'); // Remove Legend
                }
            }
        }
        
    }
  
  }); 

  //Average days between reception date and won date
  var averageReceptionWon = document.getElementById('averageReceptionWon');
  var averageReceptionWonChart = new Chart(averageReceptionWon, {
      type: 'line',
      data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: 'Won Date',
            data: [1,3,5,2,1,4,2,1,3,4,1,2],
            backgroundColor:'transparent',
            pointBackgroundColor:'rgba(113, 236, 133, 1)',
            borderColor:'rgba(113, 236, 133, 1)',
            borderWidth: 2
          },
          {
            label: 'Reception Date',
            data: [1,2,1,3,2,1,3,4,5,2,1,4],
            backgroundColor:'transparent',
            pointBackgroundColor:'rgba(255, 99, 132, 1)',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 2
          }]
      },
       options: {
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              stepSize:1
            }
          }]
        },
        elements: {
          point:{
              radius: 3,
          }
        },
        
        
    }
  
  }); 
