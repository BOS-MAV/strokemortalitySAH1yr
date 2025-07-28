/*risk calculation all cause mortality 1 year post SAH*/
function numberFormat(val, decimalPlaces) {
  var multiplier = Math.pow(10, decimalPlaces);
  return (Math.round(val * multiplier) / multiplier).toFixed(decimalPlaces);
}

function calc_risk() {
  //declare a totscore variable
  var totScore;
  //declare variables to hold the rest
  var age,
    ageCat,
    ageWeight,
    sex,
    sex_t,
    sexWeight,
    race,
    race_t,
    raceWeight,
    diabetes,
    diabetesWeight,
    dementia,
    dementiaWeight,
    bpmeds,
    bpmedsWeight,
    statin,
    statinWeight,
    systolic,
    systolicWeight,
    diastolic,
    diastolicWeight,
    totChlWeight,
    priorKid,
    priorKidWeight,
    priorHF,
    priorHFWeight,
    BMI,
    BMIWeight,
    aFibFlut,
    aFibFlutWeight,
    ethnicity_t,
    ethnicityWeight,
    hospLength,
    hospLengthWeight,
    TBIWeight,
    marker;
  const risk = [0, 0, 0, 0];
  age = parseInt($("#txtAge").val());
  // break out age by categories to compute weight
  if (age >= 18 && age <= 44) {
    ageCat = 1;
    ageWeight = -1.22959835196491;
  } else if (age <= 54) {
    ageCat = 2;
    ageWeight = -0.191112080483546;
  } else if (age <= 64) {
    ageCat = 3;
    ageWeight = 0;
  } else if (age <= 74) {
    ageCat = 4;
    ageWeight = 0.342376202436876;
  } else if (age >= 75) {
    ageWeight = 0.66338875839567;
    ageCat = 5;
  }
  //next sex
  sex_t = $("input[name = 'Sex']:checked").val();
  if (sex_t === "Male") sexWeight = 0;
  else sexWeight = -0.901648455137285;
  //race
  race_t = $("input[name = 'Race']:checked").val();
  if (race_t === "White") raceWeight = 0;
  else if (race_t === "Black") raceWeight = -0.45575364427645;
  else raceWeight = -0.874141618365997;
  // ethnicity
  ethnicity_t = $("input[name='Ethnicity']:checked").val();
  if (ethnicity_t === "nhisp") ethnicityWeight = 0;
  else ethnicityWeight = -0.452320894393428;
  //length of hospitilization
  hospLength = parseInt($("#txtHosp").val());
  //determine weights based on cat
  if (hospLength <= 4) hospLengthWeight = 0;
  else if (hospLength <= 9) hospLengthWeight = 0.0250827803674632;
  else if (hospLength <= 29) hospLengthWeight = -0.376979697279097;
  else if (hospLength <= 89) hospLengthWeight = 0.183221152036791;
  else hospLengthWeight = -0.853691590117635;
  // diabetes
  if ($("input[name = 'Diabetes']:checked").val() === "Yes") diabetes = 1;
  else diabetes = 0;
  diabetesWeight = diabetes * 0.333360256573209;
  //dementia
  if ($("input[name = 'Dementia']:checked").val() === "Yes") dementia = 1;
  else dementia = 0;
  dementiaWeight = dementia * 0.488813116482723;
  //bpmeds
  if ($("input[name='Hypertension']:checked").val() === "No") bpmedsWeight = 0;
  else bpmedsWeight = 0.361798794567222;
  //statin
  if ($("input[name = 'Statin']:checked").val() === "No") statinWeight = 0;
  else statinWeight = -0.67038814343943;
  //afib/aflut
  if ($("input[name = 'afib']:checked").val() == "No") aFibFlutWeight = 0;
  else aFibFlutWeight = -0.0101008421794295;
  //prior chronic kidney disease
  if ($("input[name = 'priorKid']:checked").val() == "No") priorKidWeight = 0;
  else priorKidWeight = 0.214336886225966;
  //prior heart failure
  if ($("input[name = 'priorHF']:checked").val() == "No") priorHFWeight = 0;
  else priorHFWeight = 0.510047320966929;
  //blood pressure/labs
  if (
    $("#BP_Sys").val() === "" ||
    $("#BP_Sys").val() === "M" ||
    $("#BP_Sys").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    bpSys = avgLabs[marker].measure[measureEnum.AVGSYS];
  } else {
    bpSys = parseFloat($("#BP_Sys").val());
  }
  //compute weights for bpsys;
  if (bpSys < 120) bpSysWeight = 0.108576339349607;
  else if (bpSys <= 129) bpSysWeight = 0.163580365974714;
  else if (bpSys <= 139) bpSysWeight = 0;
  else bpSysWeight = -0.191463214711238;

  //diastolic
  if (
    $("#BP_Dia").val() === "" ||
    $("#BP_Dia").val() === "M" ||
    $("#BP_Dia").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    bpDia = avgLabs[marker].measure[measureEnum.AVGDIA];
  } else {
    bpDia = parseFloat($("#BP_Dia").val());
  }
  //compute weights for bpdia;
  if (bpDia < 80) bpDiaWeight = 0;
  else if (bpDia <= 89) bpDiaWeight = -0.464021557568188;
  else bpDiaWeight = -0.559070936393985;
  // total chol
  //if missing then find average based on sex, race, agegroup
  if (
    $("#TotChol").val() === "" ||
    $("#TotChol").val() === "M" ||
    $("#TotChol").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    totchl = avgLabs[marker].measure[measureEnum.AVGCHOL];
    console.log(totchl);
  } else {
    totchl = parseFloat($("#TotChol").val());
    console.log("WHAT");
    console.log(parseFloat($("#TotChol").val()));
  }
  if (totchl < 200 && totchl != 0) {
    totchlWeight = 0;
  } else if (totchl >= 200 && totchl <= 239) {
    totchlWeight = -0.233724330858397;
  } else if (totchl > 250) {
    totchlWeight = 0.132124152927041;
  } else {
    totchlWeight = 0;
  }
  // bmi
  if (
    $("#BMI").val() === "" ||
    $("#BMI").val() === "M" ||
    $("#BMI").val() === "m"
  ) {
    marker = sex_t.trim().toLowerCase() + race_t.trim().toLowerCase() + ageCat;
    console.log(marker);
    BMI = avgLabs[marker].measure[measureEnum.AVGBMI];
  } else {
    BMI = parseFloat($("#BMI").val());
  }
  //TBI
  if ($("input[name='TBI']:checked").val() === "No") TBIWeight = 0;
  else TBIWeight = 0.372307;
  //compute weights for BMI;
  if (BMI < 18.5) BMIWeight = -0.336060321469909;
  else if (BMI <= 24.9) BMIWeight = 0.279985026045376;
  else if (BMI <= 29.9) BMIWeight = 0;
  else if (BMI <= 34.9) BMIWeight = -0.43547081019457;
  else if (BMI <= 39.9) BMIWeight = -0.577642293470101;
  else BMIWeight = -0.689832679592116;

  xbeta =
    ageWeight +
    sexWeight +
    raceWeight +
    ethnicityWeight +
    hospLengthWeight +
    diabetesWeight +
    dementiaWeight +
    bpmedsWeight +
    statinWeight +
    aFibFlutWeight +
    priorKidWeight +
    priorHFWeight +
    bpSysWeight +
    bpDiaWeight +
    totchlWeight +
    TBIWeight +
    BMIWeight;
  console.log(ageWeight);
  //eXbeta = Math.exp(xbeta-2.93853);
  eXbeta = Math.exp(xbeta);
  //calculate risk and put in array
  console.log(xbeta);
  console.log(eXbeta);
  //risk = 1 - Math.pow(0.98731,eXbeta);
  risk[0] = numberFormat(Math.pow(0.9381243, eXbeta) * 100, 0);
  risk[1] = numberFormat(Math.pow(0.900994, eXbeta) * 100, 0);
  risk[2] = numberFormat(Math.pow(0.8724128, eXbeta) * 100, 0);
  risk[3] = numberFormat(Math.pow(0.8289787, eXbeta) * 100, 0);
  return risk;
}
