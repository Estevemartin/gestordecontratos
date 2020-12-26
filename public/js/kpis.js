/*jshint -W033 */


console.log("Printing KPIs")

//Legend Margin
Chart.Legend.prototype.afterFit = function() {
  this.height = this.height + 20;
};

//Charts setup Functions
async function getAverageDaysFromCreationDateData(chart,year){
  const contractList =  await getContracts()
  // console.log(contractList)
  var sumDataWon=[0,0,0,0,0,0,0,0,0,0,0,0]
  var countDataWon=[0,0,0,0,0,0,0,0,0,0,0,0]

  var sumDataRecepcion=[0,0,0,0,0,0,0,0,0,0,0,0]
  var countDataRecepcion=[0,0,0,0,0,0,0,0,0,0,0,0]

  contractList.forEach(contract=>{
    const contractYearFilter =Number(contract.fechaRecepcion.split('/')[2])
    // console.log("contractYearFilter:",contractYearFilter)
    // console.log("year:",year)
    if (contractYearFilter===year){
      // console.log("Inside loop")
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
    }
    
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
async function getContractsManagedInSixDaysData(chart,year){
  const contractList =  await getContracts()
  var moreThanSixDays =[0,0,0,0,0,0,0,0,0,0,0,0]
  var lessThanSixDays=[0,0,0,0,0,0,0,0,0,0,0,0]

  // console.log(contractList)
  contractList.forEach(contract=>{
    const contractYearFilter =Number(contract.fechaRecepcion.split('/')[2])
    // console.log(contract.mainStatus)
    if (contract.mainStatus==="Closed"&&contractYearFilter===year){
      const monthNumber = Number(contract.fechaStatusWon.split('/')[1])
      let closingDays = getDaysBetweenDates(contract.fechaStatusWon,contract.historico[contract.historico.length-1].fecha)
      // console.log(contract.pq,closingDays)
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
  
  chart.config.data.datasets[0].data = lessThanSixDays
  chart.config.data.datasets[1].data = moreThanSixDays
  chart.update()
}
async function getContractsByWarningsData(chart,year){
  const contractList =  await getContracts()
  var historicoRelevante = []
  var oneWarning =[0,0,0,0,0,0,0,0,0,0,0,0]
  var twoWarnings=[0,0,0,0,0,0,0,0,0,0,0,0]
  var threeOrMoreWarnings=[0,0,0,0,0,0,0,0,0,0,0,0]

  contractList.forEach(contract=>{
    const contractYearFilter =Number(contract.fechaRecepcion.split('/')[2])
    if (contract.mainStatus==="Closed"&&contractYearFilter===Number(year)){
      const numAvisos = getNumAvisos(contract.historico)
      // console.log(numAvisos)
      const monthNumber = Number(contract.fechaStatusWon.split('/')[1])
      if (numAvisos ===0){
        oneWarning[monthNumber] = oneWarning[monthNumber]+1
      } else if (numAvisos===1){
        twoWarnings[monthNumber] = twoWarnings[monthNumber]+1
      } else if (numAvisos >= 2){
        threeOrMoreWarnings[monthNumber] = threeOrMoreWarnings[monthNumber]+1
      }
    }})
    chart.config.data.datasets[0].data = oneWarning
    chart.config.data.datasets[1].data = twoWarnings
    chart.config.data.datasets[2].data = threeOrMoreWarnings
    chart.update()
}
async function getContractsByAverageResponseDays(chart,filterType,year){
  const contractList =  await getContracts()
  const users=await getUsers()
  const departments = ['Oper','Come','Riesg','PRL', 'Gener']
  chart.config.data.datasets=[chart.config.data.datasets[0],chart.config.data.datasets[1]]
  // console.log(contractList)

  var totalhistoricos = []
  var historicoRelevante = []
  // var totalDays = [0,0,0,0,0,0,0,0,0,0,0,0]
  // var countResponses = [0,0,0,0,0,0,0,0,0,0,0,0]

  contractList.forEach(contract=>{
    const contractYearFilter =Number(contract.fechaRecepcion.split('/')[2])
    if (contractYearFilter===year){
      Array.prototype.push.apply(totalhistoricos,contract.historico)
    }
  })
  // console.log(totalhistoricos)

  totalhistoricos.forEach((accion,index)=>{
    if (accion.accion!=="Recordatorio Enviado"){
      historicoRelevante.push(accion)
    }
  })
  // console.log(historicoRelevante)
    // console.log(filterType)

  if (filterType === 'Users'){
    users.forEach((userElement,userIndex)=>{
      var totalDays = [0,0,0,0,0,0,0,0,0,0,0,0]
      var countResponses = [0,0,0,0,0,0,0,0,0,0,0,0]
      userFilter = userElement.name+" "+userElement.surname
      indexEspacio = userFilter.indexOf(" ",0)
      let persona = userFilter.slice(0,indexEspacio+2)+"."
      // console.log(persona)

      var indexLastEmail = 0

      historicoRelevante.forEach((accion,index)=>{
        if (accion.icono!=='mail-unread-outline' && accion.persona.includes(persona)){
          let days = getDaysBetweenDates(historicoRelevante[indexLastEmail].fecha,accion.fecha)
          // console.log("Last Email:", historicoRelevante[indexLastEmail].accion,historicoRelevante[indexLastEmail].fecha, "-->", accion.fecha,"(",days,")",accion.accion)

          const monthNumber = Number(accion.fecha.split('/')[1])
          totalDays[monthNumber-1]=totalDays[monthNumber-1]+days
          countResponses[monthNumber-1]=countResponses[monthNumber-1]+1
          
        } else if (accion.icono==='mail-unread-outline'){
          indexLastEmail = index
        }
      })

      result = totalDays.map((element,index)=>{
        if (countResponses[index] === 0){
          return null
        } else {
          return Math.round(100*element/countResponses[index])/100
        }
      })

      // console.log("Acumulated Response Days:",totalDays)
      // console.log("Responses Counted:",countResponses)
      // console.log("Data to Plot:",result)

      let randomColor=getRandomColor()
      randomColorBorder=randomColor + "1)"
      randomColorFill=randomColor + "0.2)"
      newDataSet = {
        label:userFilter,
        data:result,
        pointStyle:'circle',
        pointRadius:'2',
        borderWidth:1,
        fill:false,
        borderColor:randomColorBorder,
        pointBackgroundColor:randomColorBorder,
        backgroundColor:randomColorFill,
      }

      chart.config.data.datasets.push(newDataSet)
    })
  }else if (filterType==="Departments"){
    departments.forEach((departmentsElement,departmentIndex)=>{
      var totalDays = [0,0,0,0,0,0,0,0,0,0,0,0]
      var countResponses = [0,0,0,0,0,0,0,0,0,0,0,0]
      // userFilter = userElement.name+" "+userElement.surname
      // indexEspacio = userFilter.indexOf(" ",0)
      // let persona = userFilter.slice(0,indexEspacio+2)+"."
      // console.log(persona)

      var indexLastEmail = 0

      historicoRelevante.forEach((accion,index)=>{
        if (accion.icono!=='mail-unread-outline' && accion.persona.includes(departmentsElement)){
          let days = getDaysBetweenDates(historicoRelevante[indexLastEmail].fecha,accion.fecha)
          // console.log("Last Email:", historicoRelevante[indexLastEmail].accion,historicoRelevante[indexLastEmail].fecha, "-->", accion.fecha,"(",days,")",accion.accion)

          const monthNumber = Number(accion.fecha.split('/')[1])
          totalDays[monthNumber-1]=totalDays[monthNumber-1]+days
          countResponses[monthNumber-1]=countResponses[monthNumber-1]+1
          
        } else if (accion.icono==='mail-unread-outline'){
          indexLastEmail = index
        }
      })

      result = totalDays.map((element,index)=>{
        if (countResponses[index] === 0){
          return null
        } else {
          return Math.round(100*element/countResponses[index])/100
        }
      })

      // console.log("Acumulated Response Days:",totalDays)
      // console.log("Responses Counted:",countResponses)
      // console.log("Data to Plot:",result)

      let departmentName=''
      switch(departmentsElement) {
        case 'Oper': departmentName="Operaciones"; departmentColor='#06535C';break;
        case 'Come': departmentName="Comercial"; departmentColor='#67E7F5';break;
        case 'Riesg': departmentName="Control de Riesgos"; departmentColor='#0FC7DB';break;
        case 'PRL': departmentName="PRL"; departmentColor='#42595C';break;
        case 'Gener': departmentName="Dirección General"; departmentColor='#0B99A8';break;
        default:
      }
      newDataSet = {
        label:departmentName,
        data:result,
        pointStyle:'circle',
        pointRadius:'2',
        borderWidth:1,
        fill:false,
        borderColor:departmentColor,
        pointBackgroundColor:departmentColor,
        backgroundColor:departmentColor,
      }
      chart.config.data.datasets.push(newDataSet)
    })
  }
  chart.update()
}

//Warnings Required Chart
var warningsRequiredElement = document.getElementById('warningsRequired');
var warningsRequired = new Chart(warningsRequiredElement, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: '1st Warning',
      data: '',
      backgroundColor:'rgba(113, 236, 133, 0.2)',
      borderColor: 'rgba(113, 236, 133, 1)',
      borderWidth: 1
    },
    {
      label: '2nd Warning',
      data: '',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor:'rgba(255, 206, 86, 1)',
      borderWidth: 1
    },
    {
      label: '3rd Warning or more',
      data: '',
      backgroundColor:'rgba(255, 99, 132, 0.2)',
      borderColor:'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        ticks:{
          fontSize: 16
        },
        gridLines: {
          display:false
        }
      }],
      yAxes: [{
        stacked: true,
        ticks:{
          suggestedMin: 0,
          precision:0,
          fontSize: 16
        },
        scaleLabel:{
          display:true,
          labelString:'Number of Contracts',
          fontSize:16
        }
      }]
    },
    legend:{
      labels:{
        fontSize:16
      }
    }
  }
}); 

//Contracts Managed in more or less than 6 days
var sixWarnings = document.getElementById('sixWarnings');
var sixWarningsChart = new Chart(sixWarnings, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
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
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        ticks:{
          fontSize: 16
        },
        gridLines: {
          display:false
        }
      }],
      yAxes: [{
        stacked: true,
        ticks:{
          suggestedMin: 0,
          precision:0,
          fontSize: 16
        },
        scaleLabel:{
          display:true,
          labelString:'Number of Contracts',
          fontSize:16
        }
      }]
    },
    legend:{
      labels:{
        fontSize:16
      }
    }
  }
}); 

//Average response days
var averageResponseDays = document.getElementById('averageResponseDays');
var averageResponseDaysChart = new Chart(averageResponseDays, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Managed in less than 6 days',
        data: [3,3,3,3,3,3,3,3,3,3,3,3],
        backgroundColor:'transparent',
        borderColor: 'rgba(113, 236, 133, 1)',
        pointradius:'0px',
        borderWidth: 2,
        borderDash: [20,10]
      },
      {
        label: 'Managed in more than 6 days',
        data: [6,6,6,6,6,6,6,6,6,6,6,6],
        backgroundColor:'transparent',
        borderColor:'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderDash: [20,10]
        }
      ]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0,
          fontSize: 16
        },
        scaleLabel:{
          display:true,
          labelString:'Average Response Days',
          fontSize:16
        }
      }],
      xAxes:[{
        ticks:{
          fontSize: 16
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
        },
        fontSize:16,
        
      },
    }
  }
}); 

//Average days between reception date and won date
var averageReceptionWon = document.getElementById('averageReceptionWon');
var averageReceptionWonChart = new Chart(averageReceptionWon, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Won Date',
        data:'',
        backgroundColor:'rgba(113, 236, 133, 0.2)',
        pointBackgroundColor:'rgba(113, 236, 133, 1)',
        borderColor:'rgba(113, 236, 133, 1)',
        borderWidth: 2,
        fill:false,
      },
      {
        label: 'Reception Date',
        data: '',
        backgroundColor:'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor:'rgba(255, 99, 132, 1)',
        borderColor:'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill:false,
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend:{
        labels:{
          fontSize:16
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 0,
            fontSize: 16,
            precision:0
            // stepSize:5
          },
          scaleLabel:{
            display:true,
            labelString:'Average Days From Creation Date',
            fontSize:16
          }
        }],
        xAxes:[{
          ticks:{
            fontSize: 16
          }
        }]
      },
      elements: {
        point:{
            radius: 4,
        }
      },
    }
}); 

const currentDate = new Date()
const currentYear = currentDate.getFullYear()

//Executed Functions
getAverageDaysFromCreationDateData(averageReceptionWonChart,currentYear)
getContractsManagedInSixDaysData(sixWarningsChart,currentYear)
getContractsByAverageResponseDays(averageResponseDaysChart,'Users',currentYear)
getContractsByWarningsData(warningsRequired,currentYear)
setYearsToYearFilter()
// setUsersOnSelectFilter()
showFilterSelectorOnAverageResponseDaysChart()
// setCurrentDateInInput()
// startHidingFilterSelectors()

//Auxiliar functions
async function setUsersOnSelectFilter(){
  const users = await getUsers()
  // console.log(users)
  var select = document.getElementById('user-filter')
  users.forEach(user=>{
    var newOption = document.createElement('option')
    newOption.text=user.name + " " + user.surname
    select.add(newOption)
  })
}
async function getContracts () {
  try {
    // let response= await fetch("http://localhost:3000/contractmanager/kpis/contracts");
    let response= await fetch("http://assaabloy.mpasolutions.es/contractmanager/kpis/contracts");

    // console.log(response)
    let contracts = await response.json();
    // console.log(contracts)
      return contracts;
  }catch (error) {
    console.log(error);
    return ''
  }
} 
async function getUsers () {
  try {
    // let response= await fetch("http://localhost:3000/contractmanager/kpis/users");
    let response= await fetch("http://assaabloy.mpasolutions.es/contractmanager/kpis/users");

    // console.log(response)
    let users = await response.json();
    // console.log(users)
      return users;
  }catch (error) {
    console.log(error);
    return ''
  }
}
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
  result = Math.round(labourDays)
  if (result<0){
    result=0
  }
  return result
}
function startHidingFilterSelectors(){
  document.getElementById('user-filter').style.display='none'
  document.getElementById('department-filter').style.display='none'
}
function showFilterSelectorOnAverageResponseDaysChart(select){
  // console.log(select.value)
  if (select===undefined){
    // document.getElementById('user-filter').style.display='block'
    // document.getElementById('department-filter').style.display='none'
  } else{
    if (select.value === "Users" || select.value===undefined){
      document.getElementById('user-filter').style.display='block'
      document.getElementById('department-filter').style.display='none'
    } else if (select.value === "Departments"){
      document.getElementById('user-filter').style.display='none'
      document.getElementById('department-filter').style.display='block'
    } else {
      document.getElementById('user-filter').style.display='none'
      document.getElementById('department-filter').style.display='none'
    }
  }
}
function updateChartContractsByWarningsData(){
  let year = Number(document.getElementById('year-filter').value)
  getContractsByWarningsData(warningsRequired,year)
}
function updateChartContractsByAverageResponseDays(){
  let filterType = document.getElementById('select-filter-ard').value
  let year = Number(document.getElementById('year-filter').value)
  getContractsByAverageResponseDays(averageResponseDaysChart,filterType,year)
}
function updateChartContractsManagedInSixDays(){
  let year = Number(document.getElementById('year-filter').value)
  getContractsManagedInSixDaysData(sixWarningsChart,year)
}
function updateChartAverageDaysFromCreationDate(){
  let year = Number(document.getElementById('year-filter').value)
  getAverageDaysFromCreationDateData(averageReceptionWonChart,year)
}
function updateDataOnYearChange(){
  updateChartContractsByWarningsData()
  updateChartContractsByAverageResponseDays()
  updateChartContractsManagedInSixDays()
  updateChartAverageDaysFromCreationDate()
}
function getRandomColor() {
  // var letters = '0123456789ABCDEF'.split('');
  // var color = '#';
  // for (var i = 0; i < 6; i++ ) {
  //     color += letters[Math.floor(Math.random() * 16)];
  // }
  let r=randomIntFromInterval(0, 255)
  let g=randomIntFromInterval(0, 255)
  let b=randomIntFromInterval(0, 255)
  
  
  color = "rgba("+r+","+g+","+b+","
  // console.log(color)
  return color;
}
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function setCurrentDateInInput(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById('toDate').value = today;
}
function setYearsToYearFilter(){
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  // const currentYear = 2025
  const firstYear = 2020
  var select = document.getElementById('year-filter')
  for (i=firstYear;i<=currentYear;i++){
    // console.log("Inside loop (i):",i)
    var newOption = document.createElement('option')
    newOption.text=i
    select.add(newOption)
  }
}
function getNumAvisos(historico){
  // console.log("---- NEW CONTRACT ---")
  // let indexLastEmail = 0
  let maxNumAvisos = 0
  let numAvisos = 0
  for (i=0;i<historico.length;i++){
    if (historico[i].icono === "mail-unread-outline" && historico[i].accion!=="Recordatorio Enviado"){
      // indexLastEmail = i;
      numAvisos=0;
    } else {
      if (historico[i].accion==="Recordatorio Enviado"){
        numAvisos +=1
      }
      if (numAvisos > maxNumAvisos){
        maxNumAvisos = numAvisos
      }
    }
    // console.log("Nº Av:",numAvisos," | Max Nº Av:",maxNumAvisos," | Hist:",historico[i])
    
  }
  return maxNumAvisos
}
