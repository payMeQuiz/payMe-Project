//Constants
var currentTime = Math.floor((Date.now())/1000);;
var Vstart = Math.floor((Date.now())/1000)-1;
var VslicePeriodSeconds = 30;
var VamountTotal = 60;
var Vduration = 60
var released = 0;

if(currentTime >= Vstart){

    var totalPaidAMount = 0;
    for(var i = 0; totalPaidAMount <= VamountTotal; currentTime++ ){
        var timeFromStart = currentTime - Vstart;
        console.log("Time From Start"+timeFromStart);
        if(timeFromStart >= 10){
            var vestedAmount = VamountTotal * (timeFromStart/Vduration);
            vestedAmount = vestedAmount - totalPaidAMount;
             released = vestedAmount;
             totalPaidAMount += vestedAmount;
             Vstart = currentTime;
             
             console.log("********************"+i+++"*************************");
             console.log("currentTime: "+currentTime);
             console.log("timeFromStart: "+timeFromStart);
             console.log("vestedAmount: "+vestedAmount);
             console.log("Release: "+released);
             console.log("**********************************************");
        }


    }
    console.log("Total Paid out amount: " + totalPaidAMount);

}else{
    console.log("RElease all money")
}
