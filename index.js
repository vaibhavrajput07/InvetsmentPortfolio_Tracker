    // variables for calculation
    let x=0,y=0,z=0;   

    var myPieChart = null; 
    
    //Chart initialization

    const chartData = {
        labels: [],
        data: [],
        backgroundColors: [],  
    };

    // Initialize Chart
    let initializeChart = () => {
        const ctx = document.querySelector(".my-chart");
        myPieChart = new Chart(ctx, {
            type: "doughnut",  
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: "Asset value",
                    data: chartData.data,
                    backgroundColor: chartData.backgroundColors,  
                    borderColor:'#000000',
                    borderWidth:0.5
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.raw + '%'; // Adds percentage sign to tooltip data
                            }
                        }
                    }
                }
            }
        });
    }

    //starting of code
    //ADD New Investment Button

    let addInvestment=document.querySelector(".addInvestment");  //NewInvestmentButton
    let NewInvestment=document.querySelector(".container");     // NewInvestment Form Container div
    let ChartTitle=document.querySelector(".chart1");
    

    addInvestment.addEventListener("click",(event)=>{
        event.preventDefault();
        NewInvestment.classList.toggle("container2");  // Set Visible true(Display)
        ChartTitle.classList.toggle("chart1");
        if (!myPieChart) {
            initializeChart();  // Initialize chart if not already created
        }
        
    });

    // this code for Investment form submit form

    let addNew=document.querySelector(".add");   //this is the investment form button

    let assest=document.querySelector(".i1");    //input field1   assest Name
    let invested=document.querySelector(".i2");  //input field2   invested value
    let current=document.querySelector(".i3");   //input field3   current value

    addNew.addEventListener("click",(event)=>{
        event.preventDefault();
        
        if(assest.value && invested.value && current.value){
        NewList();
        }  
        else{
            alert("please enter a data");
        }
    });  

    //newlist for a table
    NewList=()=>{

        let{table,row,td1,td2,td3,td4,td5}=tableContruct();

        //change of percentage (function calling)
        let change=Change(invested.value,current.value);

        td4.textContent=change+"%";

        mainLabel(current.value,invested.value,1);  //Label calling
        
        let{UpdateBtn,deleteBtn}=Update_Delete_button();  //for button creation
    
        td5.append(UpdateBtn);
        td5.append(deleteBtn);

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
        row.appendChild(td5);

        table.appendChild(row);

        //Update button5
        UpdateBtn.addEventListener("click",()=>{
                let previousVal=parseInt(td3.textContent);
                let newVal=prompt("Enter current price");
                if(newVal){
                    td3.textContent=newVal;
                    let invested=td2.textContent;
                    let labelToRemove=td1.innerText;
                    let labelIndex=chartData.labels.indexOf(labelToRemove);
                    
                    if(previousVal>newVal){
                        let change=UpdateValue(previousVal,newVal,invested,0);
                        td4.innerText=change+"%";
                        
                        if(labelIndex>-1){
                            chartData.data.splice(labelIndex,1,change);    
                            console.log(change);
                            myPieChart.update();  // Refresh the chart
                        }
                    }else if(previousVal<newVal){
                        let change=UpdateValue(previousVal,newVal,invested,1);
                        td4.innerText=change+"%";
                        
                        if(labelIndex>-1){
                            chartData.data.splice(labelIndex,1,change);    
                            console.log(change);
                            myPieChart.update();  // Refresh the chart
                        }
                        }
                }
                else{
                    alert("Value not changed");
                }     
        });
        //delete button
        deleteBtn.addEventListener("click",(event)=>{   
                    
                event.preventDefault();   
                table.removeChild(row);
                mainLabel(td3.innerText,td2.innerText,0);   
        
                let labelToRemove=td1.innerText;
                let labelIndex=chartData.labels.indexOf(labelToRemove);
                if(labelIndex>-1){
                    chartData.labels.splice(labelIndex,1);
                    chartData.data.splice(labelIndex,1);
                    chartData.backgroundColors.splice(labelIndex,1);
                }
                myPieChart.update();  // Refresh the chart
    });
        // graphDiv.classList.remove("container");
        NewInvestment.classList.toggle("container2");

        assest.value="";
        invested.value="";
        current.value="";
        
    }

    //table construction 
    let tableContruct=()=>{
        let table=document.querySelector("#myTable thead"); 
        let row=document.createElement("tr");

        let td1=document.createElement("td");
        let td2=document.createElement("td");
        let td3=document.createElement("td");
        let td4=document.createElement("td");
        let td5=document.createElement("td");

        td1.textContent=assest.value;
        td2.textContent=invested.value;
        td3.textContent=current.value;

        // Update the Pie Chart
        let updatePieChart = (label, value) => {
            if (!myPieChart) {
            initializeChart();  // Initialize chart if not already created
            }
            chartData.labels.push(label);
            chartData.data.push(value);

            // Generate a random background color for the new slice
            let getRandomColor = () => {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgba(${r}, ${g}, ${b}, 0.6)`;  // Random RGBA color
                };
                chartData.backgroundColors.push(getRandomColor());

                myPieChart.data.labels = chartData.labels;  // Update labels
                myPieChart.data.datasets[0].data = chartData.data;  // Update data
                myPieChart.data.datasets[0].backgroundColor = chartData.backgroundColors;  // Update background colors

                myPieChart.update();  // Refresh the chart
            };
            //change of percentage (function calling)

            let change=Change(invested.value,current.value);
            updatePieChart(assest.value,parseInt(change));

            return {table,row,td1,td2,td3,td4,td5}
    }

    //percentage calculate
    let Change=(invested,current)=>{
        let change=(current-invested)/invested*100;
        return change;
    }

    //Main Labels function

    let mainLabel=(a,b,check)=>{   //here a is current val and b is invested val
        let totalAMT=document.querySelector(".CurrentTotal");             
        let x=parseInt(totalAMT.innerText);
        let totalInvest=document.querySelector(".totalInvest"); 
        let y=parseInt(totalInvest.innerText);

        if(check===1){
            x = x + parseInt(a);
            y = y + parseInt(b);
            totalAMT.innerText = x;
            totalInvest.innerText = y;
        }
        else if(check===0){
            x = x - parseInt(a);
            y = y - parseInt(b);
            totalAMT.innerText = x;   
            totalInvest.innerText = y; 
        }  
    }

    let Update_Delete_button=()=>{

        let UpdateBtn=document.createElement("button");  
        let deleteBtn=document.createElement("button");

        UpdateBtn.innerText="Update";
        deleteBtn.innerText="Delete";
        
        //This is the in-built classes of BootStrap.

        UpdateBtn.classList.add("btn");
        UpdateBtn.classList.add("btn-primary")
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("btn-danger");

        return {UpdateBtn,deleteBtn};
    }

    //updateValue
    let UpdateValue=(b,a,invested,check)=>{

        let totalAMT = document.querySelector(".CurrentTotal");          // Label of total value
        let tA = parseInt(totalAMT.innerText);
        
        if(check === 0){
            tA = tA-(b - a)
            totalAMT.innerText = tA;

            let change=Change(parseInt(invested),a);
            return change;
        }
        else if(check === 1){
            tA = (parseInt(tA)-parseInt(b))+parseInt(a);
            totalAMT.innerText = tA;

            let change=Change(parseInt(invested),a);
            return change;
        } 
    }

