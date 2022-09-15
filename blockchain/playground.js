//Constants
var currentTime = Math.floor((Date.now())/1000);;
var Vstart = Math.floor((Date.now())/1000)-3;
var VslicePeriodSeconds = 30;
var VamountTotal = 60;
var Vduration = 60
var released = 0;

if(currentTime >= Vstart){

    var totalPaidAMount = 0;
    for(var i = 0; currentTime < Vstart + Vduration; currentTime++ ){
        var timeFromStart =currentTime - Vstart;
        var secondsPerSlice = VslicePeriodSeconds;
        var vestedSlicePeriods = timeFromStart/secondsPerSlice;
        var vestedSeconds = vestedSlicePeriods * secondsPerSlice;
        var vestedAmount = VamountTotal * vestedSeconds/Vduration;
        vestedAmount = vestedAmount - released;
        released = vestedAmount;
        totalPaidAMount += vestedAmount;
        
        console.log("********************"+i+++"*************************");
        console.log("currentTime: "+currentTime);
        console.log("timeFromStart: "+timeFromStart);
        console.log("vestedSlicePeriods: "+vestedSlicePeriods);
        console.log("vestedSeconds: "+vestedSeconds);
        console.log("vestedAmount: "+vestedAmount);
        console.log("**********************************************");

    }
    console.log("Total Paid out amount: " + totalPaidAMount);

}else{
    console.log("RElease all money")
}
