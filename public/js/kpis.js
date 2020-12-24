/*jshint -W033 */

console.log("Printing KPIs")

// getContracts()
async function getContracts () {
  try {
    // Editar URL para deploy con "http://assaabloy.mpasolutions.es/contractmanager/kpis/contracts"
    let response= await fetch("http://localhost:3000/contractmanager/kpis/contracts");
    // console.log(response)
    let contracts = await response.json();
    // console.log(contracts)
      return contracts;
  }catch (error) {
    console.log(error);
    return ''
  }
} 

// getUsers()
async function getUsers () {
  try {
    let response= await fetch("http://localhost:3000/contractmanager/kpis/users");
    // console.log(response)
    let users = await response.json();
    // console.log(users)
      return users;
  }catch (error) {
    console.log(error);
    return ''
  }
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
document.getElementById('toDate').value = today;






async function getAverageDaysFromCreationDateData(chart){
  const contractList =  await getContracts()
  // console.log(contractList)
  let sumDataWon=[0,0,0,0,0,0,0,0,0,0,0,0]
  let countDataWon=[0,0,0,0,0,0,0,0,0,0,0,0]

  let sumDataRecepcion=[0,0,0,0,0,0,0,0,0,0,0,0]
  let countDataRecepcion=[0,0,0,0,0,0,0,0,0,0,0,0]

  contractList.forEach(contract=>{
    const monthNumber = Number(contract.fechaStatusWon.split('/')[1])
    // console.log(monthNumber)
    let daysWon = getDaysBetweenDates(contract.fechaStatusWon,contract.fechaCreaccionApp)
    // console.log("Fecha Status Won: ", contract.fechaStatusWon, " | Fecha Creación App: ",contract.fechaCreaccionApp, " | Dias entre Fechas: ",daysWon, " | Month: ",monthNumber)
    // console.log(daysWon)
    let daysRecepcion = getDaysBetweenDates(contract.fechaRecepcion,contract.fechaCreaccionApp)
    // console.log("Fecha Recepción: ", contract.fechaRecepcion, " | Fecha Creación App: ",contract.fechaCreaccionApp, " | Dias entre Fechas: ",daysRecepcion, " | Month: ",monthNumber)
    
    countDataWon[monthNumber]=countDataWon[monthNumber]+1
    countDataRecepcion[monthNumber]=countDataRecepcion[monthNumber]+1
    sumDataWon[monthNumber]=sumDataWon[monthNumber]+daysWon
    sumDataRecepcion[monthNumber]=sumDataRecepcion[monthNumber]+daysRecepcion
    // console.log("Sum Data Won: ",sumDataWon)
    // console.log("Count Data Won: ",countDataWon)
  })
  
  let resultWon = countDataWon.map((element,index)=>{
    if(element===0){
      return null
    } else {
      return sumDataWon[index]/element
    }
  })
  // console.log("Result Won: ",resultWon)

  let resultRecepcion = countDataRecepcion.map((element,index)=>{
    if(element===0){
      return null
    } else {
      return sumDataRecepcion[index]/element
    }
  })
  // console.log("Result Recepcion: ",resultRecepcion)

  chart.config.data.datasets[0].data = resultWon
  chart.config.data.datasets[1].data = resultRecepcion
  chart.update()
}

async function getContractsManagedInSixDaysData(chart){
  const contractList =  await getContracts()
  var moreThanSixDays =[0,0,0,0,0,0,0,0,0,0,0,0]
  var lessThanSixDays=[0,0,0,0,0,0,0,0,0,0,0,0]

  // console.log(contractList)
  contractList.forEach(contract=>{
    // console.log(contract.mainStatus)
    if (contract.mainStatus==="Closed"){
      const monthNumber = Number(contract.fechaStatusWon.split('/')[1])
      let closingDays = getDaysBetweenDates(contract.fechaStatusWon,contract.historico[contract.historico.length-1].fecha)
      // console.log(closingDays)
      if(closingDays<=6){
        lessThanSixDays[monthNumber] = lessThanSixDays[monthNumber]+1
      } else {
        moreThanSixDays[monthNumber] = moreThanSixDays[monthNumber]+1
      }
    }

    
  })
  
  lessThanSixDays.forEach(element=>{
    if (element===0){
      return null
    }else{
      return element
    }
  })

  moreThanSixDays.forEach(element=>{
    if (element===0){
      return null
    }else{
      return element
    }
  })
  // console.log(lessThanSixDays)
  // console.log(moreThanSixDays)

  // console.log(chart)
  chart.config.data.datasets[0].data = lessThanSixDays
  chart.config.data.datasets[1].data = moreThanSixDays
  chart.update()
}

async function getContractsByWarningsData(chart){
  const contractList =  await getContracts()
  let oneWarning =[0,0,0,0,0,0,0,0,0,0,0,0]
  let twoWarnings=[0,0,0,0,0,0,0,0,0,0,0,0]
  let threeOrMoreWarnings=[0,0,0,0,0,0,0,0,0,0,0,0]

  // // console.log(contractList)
  // contractList.forEach(contract=>{
  //   // console.log(contract.mainStatus)
  //   if (contract.mainStatus==="Closed"){
  //     const monthNumber = Number(contract.fechaStatusWon.split('/')[1])
  //     let closingDays = getDaysBetweenDates(contract.fechaStatusWon,contract.historico[contract.historico.length-1].fecha)
  //     // console.log(closingDays)
  //     if(closingDays<=6){
  //       lessThanSixDays[monthNumber] = lessThanSixDays[monthNumber]+1
  //     } else {
  //       moreThanSixDays[monthNumber] = moreThanSixDays[monthNumber]+1
  //     }
  //   }

    
  // })
  // lessThanSixDays.forEach(element=>{
  //   if (element===0){
  //     return null
  //   }else{
  //     return element
  //   }
  // })

  // moreThanSixDays.forEach(element=>{
  //   if (element===0){
  //     return null
  //   }else{
  //     return element
  //   }
  // })
  // // console.log(lessThanSixDays)
  // // console.log(moreThanSixDays)

  // // console.log(chart)
  // chart.config.data.datasets[0].data = lessThanSixDays
  // chart.config.data.datasets[1].data = moreThanSixDays
  // chart.update()

}



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
              stacked: true,
              ticks:{
                suggestedMin: 0,
                precision:0
              }
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
          data: '',
          backgroundColor:'rgba(113, 236, 133, 0.2)',
          borderColor:'rgba(113, 236, 133, 1)',
          borderWidth: 1
        },
        {
          label: 'Managed in more than 6 days',
          data: '',
          backgroundColor:'rgba(255, 99, 132, 0.2)',
          borderColor:'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
    },
      options: {
      scales: {
          xAxes: [{
              stacked: true
          }],
          yAxes: [{
              stacked: true,
              ticks:{
                suggestedMin: 0,
                precision:0

              }
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
          data:'',
          backgroundColor:'transparent',
          pointBackgroundColor:'rgba(113, 236, 133, 1)',
          borderColor:'rgba(113, 236, 133, 1)',
          borderWidth: 2
        },
        {
          label: 'Reception Date',
          data: '',
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

            // stepSize:5
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

getAverageDaysFromCreationDateData(averageReceptionWonChart)
getContractsManagedInSixDaysData(sixWarningsChart)


//Auxiliar function
function getDaysBetweenDates(initialDate,finalDate){
  initialDateNewFormat = initialDate.split('/')[2]+"-"+initialDate.split('/')[1]+"-"+initialDate.split('/')[0]
  finalDateNewFormat = finalDate.split('/')[2]+"-"+finalDate.split('/')[1]+"-"+finalDate.split('/')[0]
  const initialDateFormated = new Date(initialDateNewFormat)
  const finalDateFormated = new Date(finalDateNewFormat)
  // console.log(initialDateFormated.toDateString())
  let dateDiffInMiliseconds =  finalDateFormated.getTime() - initialDateFormated.getTime()
  let dateDiffInDays = dateDiffInMiliseconds/(1000*60*60*24)
  // console.log(initialDateFormated.getDate())
  
  let noLabourDays = 0
  for (i=0;i<dateDiffInDays+1;i++){
    let checkingDate = new Date()
    checkingDate.setDate(initialDateFormated.getDate()+i)
    if (checkingDate.getDay()===0||checkingDate.getDay()===6){
      noLabourDays+=1      
    }
  //   console.log(checkingDate.toDateString(),"--->",checkingDate.getDay(),"No Labour days:",noLabourDays)
  }
  
  let labourDays=dateDiffInDays-noLabourDays
  // console.log("Total Days:",dateDiffInDays)
  // console.log("No Labour days:",noLabourDays)
  // console.log("Labour Days:",labourDays)
  
  return Math.round(labourDays)
}
