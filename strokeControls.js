/* Program Title: strokeControl.js
 * Author: John Russo
 * Date: April 2025
 * 
 * Description: This program controls all data entry and navigation for the stroke 1 yr SAH
 * 
 */
// declare tooltip variables

var txtAgeToolTipOn = 1;
var txtHospToolTipOn = 1;
var BP_SysToolTipOn = 1;
var BP_DiaToolTipOn = 1;
var totCholToolTipOn = 1;
var creatToolTipOn = 1;
var BMIToolTipOn = 1;

/*function to fix problem with digits - i.e. user enters 1..2 */
function enforceOneDigitTwoDecimal(input) {
    input = input.replace("/[^\d.]/g", '');
    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '');
    }
  
    const match = input.match(/^(\d)?(?:\.(\d{0,2})?)?/);
    if (match) {
      const before = match[1] || '';
      const after = match[2] || '';
      return before + (after !== '' ? '.' + after : '');
    }
  
    return '';
  }

$(function () {
    $(".controlgroup").controlgroup();
    $(".controlgroup-vertical").controlgroup({
        "direction": "vertical"
    });
});
// get selection
$('.colors input[type=radio]').on('change', function () {
    console.log(this.value);
});
$("input:radio[name='thename']").each(function (i) {
    this.checked = false;
});

$(document).ready(function () {
    /*$('[data-toggle="tooltip"]').tooltip({
        trigger: 'focus', // or 'hover' or 'manual' as needed
        placement: 'bottom'
    });*/

    //$("#txtAge").focus().select();
    //set focus on txtAge
    setTimeout(function () {
        $("#txtAge").focus().select();
    }, 200);
    // loads json array of missing values

    loadAvgArray().then(() => {
        // Now avgLabs is ready to use
        console.log(avgLabs["malewhite1"].measure[measureEnum.AVGSYS]);
    });
    
    //create tooltips

    $("#txtAge").tooltip({title: "Please enter an age between 20 and 79", placement: "bottom", trigger: "manual"});
    $("#sexMark").tooltip({title: "Please choose either Male or Female", placement: "bottom", trigger: "manual"});
    $("#raceMark").tooltip({title: "Please choose White, African American or Other", placement: "bottom", trigger: "manual"});
    $("#ethMark").tooltip({title: "Please choose not Hispanic/Latino or Hispanic/Latino", placement: "bottom", trigger: "manual"});
    $("#txtHosp").tooltip({title: "Please enter a value between 1 and 365", placement: "bottom", trigger: "manual"});
    $("#diabMark").tooltip({title: "Please choose either yes or no",placement: "bottom", trigger: "manual"});
    $("#dementiaMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger:"manual"});
    $("#hyperMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger:"manual"});
    $("#statinMark").tooltip({title: "Please choose either yes or no",placement:"bottom", trigger:"manual"});
    $("#priorKidMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger: "manual"});
    $("#priorHFMark").tooltip({title: "Please choose either yes or no",placement:"bottom",trigger: "manual"});
    $("#BP_Sys").tooltip({title: "Please enter a systolic blood pressure between 80 and 300 mm HG, leave blank if you do not have a value", placement: "right", trigger: "manual"});
    $("#BP_Dia").tooltip({title: "Please enter a diastolic blood pressure between 50 and 180 mm HG, leave blank if you do not have a value", placement: "right", trigger: "manual"});
    $("#TotChol").tooltip({title: "Please enter total cholesterol between 0 and 500 mg/dL, leave blank if you do not have a value", placement: "bottom", trigger: "manual"});
    $("#creat").tooltip({title: "Please enter creatinine level between 0.59 and 1.39 mg/dL, leave blank if you do not have a value", placement: "bottom", trigger: "manual"});
    $("#BMI").tooltip({title: "Please enter a BMI between 12 and 60,leave blank if you do not have a value", placement: "bottom", trigger: "manual"});

    //submit onclick handler

    $('#sub').on('click', function (event) {
        var isvalidate = $("#myForm")[0].checkValidity();
        //if the form is valid and all text fields validate then proceed with message
        if ((isvalidate) && txtAge_Val() && txtHosp_Val() && BP_Sys_Val() && BP_Dia_Val() && totChol_Val() && creat_Val() && BMI_Val()) {
            event.preventDefault();
            var risk_res = [];
            risk_res = calc_risk();
            $('#message').html('30 day risk ' + risk_res[0]+"%<br/>90 day risk "+risk_res[1]+"%<br/>6 month risk "+risk_res[2]+
                "%</br>1 year risk "+risk_res[3]+"%");
            //$('#message').html('Results ' + calc_risk()+"%");
            $('#myModal').modal('show');
        }
        else
        {
            //find out where invalid value is or unchecked button
            
            if (txtAge_Val())
            {
                txtAgeToolTipOn = 1;
                $("#txtAge").tooltip("hide");
                if (($("input[name = 'Sex']:checked").val() !== 'Male') && ($("input[name = 'Sex']:checked").val() !== 'Female'))
                {
                    $("#sexMark").tooltip("show");
                    $("#sex").focus();
                }
                else
                {
                    $("#sexMark").tooltip("hide");
                    if (($("input[name = 'Race']:checked").val() != 'White') && ($("input[name = 'Race']:checked").val() != 'AfrAm')
                            && ($("input[name = 'Race']:checked").val() != 'Hisp') && ($("input[name = 'Race']:checked").val() != 'Other'))
                    {
                        $("#raceMark").tooltip("show");
                        $("#race").focus();
                    }
                    else
                    {
                        $("#raceMark").tooltip("hide");
                        if (($("input[name = 'Ethnicity']:checked").val() !== 'Yes') && ($("input[name = 'Ethnicity']:checked").val() != 'No'))
                            {
                               $("#ethnMark").tooltip("show");
                               $("#ethn").focus();
                            }
                        else
                            {
                                $("#ethnMark").tooltip("hide");
                                if (($("input[name = 'Diabetes']:checked").val() !== 'Yes') && ($("input[name = 'Diabetes']:checked").val() != 'No'))
                                {
                                     $("#diabMark").tooltip("show");
                                     $("#diab").focus();
                                }
                                else
                                {
                                    $("#diabMark").tooltip("hide");
                                    if (($("input[name = 'dementia']:checked").val() !== 'Yes') && ($("input[name = 'dementia']:checked").val() !== 'No'))
                                    {
                                        $("#dementiaMark").tooltip("show");
                                        $("#dementia").focus();
                                    }
                                    else
                                    {
                                       $("#dementiaMark").tooltip("hide");
                                        if (($("input[name = 'Hypertension']:checked").val() !== 'Yes') && ($("input[name = 'Hypertension']:checked").val() !== 'No'))
                                        {
                                        $("#hyperMark").tooltip("show");
                                            $("#hbp").focus();
                                        }
                                        else
                                        {
                                            $("#hyperMark").tooltip("hide");
                                            if (($("input[name = 'Statin']:checked").val() !== 'Yes') && ($("input[name = 'Statin']:checked").val() !== 'No'))
                                            {
                                                $("#statinMark").tooltip("show");
                                                $("#Statin").focus();
                                            }
                                            else
                                            {
                                                $("#statinMark").tooltip("hide");
                                                if (($("input[name= 'afib']:checked").val() !== 'Yes') && ($("input[name= 'afib']:checked").val() !== 'No'))
                                                {
                                                    $("#afibMark").tooltip("show");
                                                    $("#afib").focus();
                                                }
                                                else
                                                {
                                                    $("#afibMark").tooltip("hide");                                          
                                                        
                                                    if (($("input[name= 'priorKid']:checked").val() !== 'Yes') && ($("input[name= 'priorKid']:checked").val() !== 'No'))
                                                    {
                                                        $("#priorKid").tooltip("show");
                                                        $("#priorKid").focus();
                                                          
                                                    }
                                                    else
                                                    {
                                                        $("priorKid").tooltip("hide");
                                                        if (($("input[name= 'priorHF']:checked").val() !== 'Yes') && ($("input[name= 'priorHF']:checked").val() !== 'No'))
                                                        {
                                                            $("#priorHF").tooltip("show");
                                                            $("#priorHF").focus();
                                                              
                                                        }
                                                        else 
                                                        
                                                        if (!(BP_Sys_Val()))
                                                        {
                                                            $("#BP_Sys").tooltip("show");
                                                            $("#BP_Sys").focus();
                                                        }
                                                        else
                                                        {
                                                            $("#BP_Sys").tooltip("hide");
                                                            BP_SysToolTipOn = 1;
                                                            if (!(BP_Dia_Val()))
                                                            {
                                                                $("#BP_Dia").tooltip("show");
                                                                $("#BP_Dia").focus();
                                                            }
                                                            else
                                                            {
                                                                $("#BP_Dia").tooltip("hide");
                                                                BP_DiaToolTipOn = 1;
                                                                if (!(totChol_Val()))
                                                                {
                                                                    $("#totChol").tooltip("show");
                                                                    $("#totChol").focus();
                                                                }
                                                                else
                                                                {
                                                                    $("#totChol").tooltip("hide");
                                                                    totCholToolTipOn = 1;
                                                                    if (!(creat_Val()))
                                                                    {
                                                                        $("#creat").tooltip("show");
                                                                        $("#creat").focus().select();
                                                                    }
                                                                    else
                                                                    {
                                                                        $("#creat").tooltip("hide");
                                                                        creatToolTipOn  = 1;
                                                                        if (!(BMI_Val()))
                                                                        {       
                                                                            $("#BMI").tooltip("show");
                                                                            $("#BMI").focus().select();
                                                                        }
                                                                        else
                                                                        {
                                                                            $("#BMIL").tooltip("hide");
                                                                            BMIToolTipOn =1;
                                                                        }
                                                            }                                                
                                                        }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
        }
    }
}
    });
    $('#BP_Sys').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Sys_Val()) {
                $("#BP_Dia").focus().select();
            }
        }
    });

    $('#BP_Dia').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Dia_Val()) {
                $("#TotChol").focus().select();
            }
        }
    });

    $('#TotChol').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (totChol_Val()) {
                $("#creat").focus().select();
            }
        }
    });

    $('#creat').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (creat_Val()) {
                $("#BMI").focus().select();
            }
        }
    });
    $("#txtAge").blur(function () {
          if (txtAge_Val())
          {
            txtAgeToolTipOn = 1;
            $("#sex").focus().select();
          }
    });

    $("#txtHosp").blur(function () {
        if (txtHosp_Val())
        {
          txtHospToolTipOn = 1;
        }
  });
  $("#BP_Sys").blur(function () {
    if (BP_Sys_Val())
    {
        BP_SysToolTipOn = 1;
    }
});

$("#BP_Dia").blur(function () {
    if (BP_Dia_Val())
    {
        BP_DiaToolTipOn = 1;
    }
});

$("#TotChol").blur(function () {
    if (totChol_Val())
    {
        totCholToolTipOn = 1;
    }
});

$("#creat").blur(function () {
    if (creat_Val())
    {
        creatToolTipOn = 1;
    }
});

$("#BMI").blur(function () {
    if (BMI_Val())
    {
        BMIToolTipOn = 1;
    }
});

$("#ethn").change(function (){
    
    $("#txtHosp").focus().select();
    
})


    $("input[name='Sex']").change(function () {
        $("#sexMark").tooltip("hide");
        if ($("input[name='Sex']:checked").val()==="Male")
        {
            $("#sexMark").addClass("btn-selected");
            $("#maleGlyph").show();
            $("#femaleGlyph").hide();            
            $("#sexMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#sexMark1").addClass("btn-selected");
            $("#femaleGlyph").show();
            $("#maleGlyph").hide();
            $("#sexMark").removeClass("btn-selected");
        }
        $("#race").focus();
    });

    $("input[name='Race']").change(function () {
        $("#raceMark").tooltip("hide");
        if ($("input[name='Race']:checked").val()==="White")
        {
            $("#raceMark").addClass("btn-selected");
            $("#whiteGlyph").show();
            $("#afrAmGlyph").hide();  
            $("#otherRaceGlyph").hide();          
            $("#raceMark1").removeClass("btn-selected");
            $("#raceMark2").removeClass("btn-selected");
        }
        else if ($("input[name='Race']:checked").val()==="Black")
        {
            
            $("#raceMark1").addClass("btn-selected");
            $("#afrAmGlyph").show();
            $("#whiteGlyph").hide();
            $("#otherRaceGlyph").hide();     
            $("#raceMark").removeClass("btn-selected");
            $("#raceMark2").removeClass("btn-selected");
        }
        else
        {
             
            $("#raceMark2").addClass("btn-selected");
            $("#otherRaceGlyph").show();
            $("#whiteGlyph").hide();
            $("#afrAmGlyph").hide();  
            $("#raceMark").removeClass("btn-selected");
            $("#raceMark1").removeClass("btn-selected");
        }
    });
        $("input[name='Ethnicity']").change(function () {
            $("#ethnMark").tooltip("hide");
            if ($("input[name='Ethnicity']:checked").val()==="nhisp")
            {
                $("#ethnMark").addClass("btn-selected");
                $("#nhspGlyph").show();
                $("#hspGlyph").hide();                 
                $("#ethnMark1").removeClass("btn-selected");
            }
            else
            {
                $("#ethnMark1").addClass("btn-selected");
                $("#hspGlyph").show();
                $("#nhspGlyph").hide();                 
                $("#ethnMark").removeClass("btn-selected");
            }
        $("#Diabetes").focus();
    });
    $("input[name='Diabetes']").change(function () {
        $("#diabMark").tooltip("hide");
        if ($("input[name='Diabetes']:checked").val()==="Yes")
        {
            $("#diabMark").addClass("btn-selected");
            $("#diabYGlyph").show();
            $("#diabNGlyph").hide();            
            $("#diabMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#diabMark1").addClass("btn-selected");
            $("#diabNGlyph").show();
            $("#diabYGlyph").hide();
            $("#diabMark").removeClass("btn-selected");
        }
        $("#dementia").focus();
    });
    $("input[name='Dementia']").change(function () {
       $("#dementMark").tooltip("hide");
       if ($("input[name='Dementia']:checked").val()==="Yes")
        {
            $("#dementMark").addClass("btn-selected");
            $("#dementYGlyph").show();
            $("#dementNGlyph").hide();            
            $("#dementMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#dementMark1").addClass("btn-selected");
            $("#dementNGlyph").show();
            $("#dementYGlyph").hide();
            $("#dementMark").removeClass("btn-selected");
        }
       $("#hbp").focus();
    });
    $("input[name='Hypertension']").change(function (){
       $("#hyperMark").tooltip("hide");
       if ($("input[name='Hypertension']:checked").val()==="Yes")
        {
            $("#hyperMark").addClass("btn-selected");
            $("#hyperYGlyph").show();
            $("#hyperNGlyph").hide();            
            $("#hyperMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#hyperMark1").addClass("btn-selected");
            $("#hyperNGlyph").show();
            $("#hyperYGlyph").hide();
            $("#hyperMark").removeClass("btn-selected");
        }
       $("Statin").focus();
    });
    $("input[name='Statin']").change(function () {
       $("#statinMark").tooltip("hide");
       if ($("input[name='Statin']:checked").val()==="Yes")
        {
            $("#statinMark").addClass("btn-selected");
            $("#statinYGlyph").show();
            $("#statinNGlyph").hide();            
            $("#statinMark1").removeClass("btn-selected");
        }
        else
        {
            
            $("#statinMark1").addClass("btn-selected");
            $("#statinNGlyph").show();
            $("#statinYGlyph").hide();
            $("#statinMark").removeClass("btn-selected");
        }
       $("#afib").focus();
    });
    $("input[name='afib']").change(function () {
        $("#afibMark").tooltip("hide");
        if ($("input[name='afib']:checked").val()==="Yes")
         {
             $("#afibMark").addClass("btn-selected");
             $("#afibYGlyph").show();
             $("#afibNGlyph").hide();            
             $("#afibMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#afibMark1").addClass("btn-selected");
             $("#afibNGlyph").show();
             $("#afibYGlyph").hide();
             $("#afibMark").removeClass("btn-selected");
         }
        $("#priorKid").focus();
     });
     $("input[name='priorKid']").change(function () {
        $("#priorKidMark").tooltip("hide");
        if ($("input[name='priorKid']:checked").val()==="Yes")
         {
             $("#priorKidMark").addClass("btn-selected");
             $("#priorKidYGlyph").show();
             $("#priorKidNGlyph").hide();            
             $("#priorKidMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#priorKidMark1").addClass("btn-selected");
             $("#priorKidNGlyph").show();
             $("#priorKidYGlyph").hide();
             $("#priorKidMark").removeClass("btn-selected");
         }
        $("#priorHF").focus();
     });
     $("input[name='priorHF']").change(function () {
        $("#priorHFMark").tooltip("hide");
        if ($("input[name='priorHF']:checked").val()==="Yes")
         {
             $("#priorHFMark").addClass("btn-selected");
             $("#priorHFYGlyph").show();
             $("#priorHFNGlyph").hide();            
             $("#priorHFMark1").removeClass("btn-selected");
         }
         else
         {
             
             $("#priorHFMark1").addClass("btn-selected");
             $("#priorHFNGlyph").show();
             $("#priorHFYGlyph").hide();
             $("#priorHFMark").removeClass("btn-selected");
         }
        //$("#BP_Sys").focus().select();
        setTimeout(function() {
            $('#BP_Sys').focus().select();
        }, 100);
  
     });
    $("#BP_Sys").blur(function () {
        if (BP_Sys_Val())
        {
            BP_SysToolTipOn = 1;
        }
    });
   /* $("#BP_Sys").change(function () {
     
        if (BP_Sys_Val())
        {
            setTimeout(function () {
                $("#BP_Dia").focus().select();
            }, 100);
            BP_SysToolTipOn = 1;
        }
    });*/
    $("#BP_Sys").on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (BP_Sys_Val()) {
                $("#BP_Dia").focus().select();
            }
        }
    });
    $("#BP_Dia").blur(function () {
       
       if (BP_Dia_Val())
       {
        BP_DiaToolTipOn = 1;
       }
    });
    $("#BP_Dia").change(function () {
     
        if (BP_Dia_Val())
        {
            setTimeout(function () {
                $("#TotChol").focus().select();
            }, 100);
            BP_DiaToolTipOn = 1;
        }
    });
    $("#TotChol").blur(function () {
       if (totChol_Val())
       {
        setTimeout(function () {
            $("#creat").focus().select();
        }, 100);
        totCholToolTipOn = 1;
       }
    });
    $("#TotChol").change(function () {
        if (totChol_Val())
        {
            setTimeout(function () {
                $("#creat").focus().select();
            }, 100);
         totCholToolTipOn = 1;
        }
     });
    
});

function txtAge_Val() {
        var input = $("#txtAge");
        if ((parseInt(input.val()) < 20 || parseInt(input.val()) > 79) || (input.val() === ''))
        {
            if (txtAgeToolTipOn===1)
            {
                $("#txtAge").tooltip("show");
                input.removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#txtAge").prop("disabled",false);
                $("#txtAge").focus();
                txtAgeToolTipOn = 0;
            }
             return false;
        }
        else
        {
            $("#txtAge").tooltip("hide");
            input.removeClass("invalid").addClass("valid");
            $("#myForm input").prop("disabled",false);
            $("#myForm button").prop("disabled",false);
            $("#sex").focus().select();
            return true;
        }
}

function txtHosp_Val() {
    var input = $("#txtHosp");
    if ((parseInt(input.val()) < 1 || parseInt(input.val()) > 365) || (input.val() === ''))
    {
        if (txtHospToolTipOn===1)
        {
            $("#txtHosp").tooltip("show");
            input.removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#txtHosp").prop("disabled",false);
            $("#txtHosp").focus();
            txtHospToolTipOn = 0;
        }
         return false;
    }
    else
    {
        $("#txtHosp").tooltip("hide");
        input.removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#diab").focus();
        return true;
    }
}
function BP_Sys_Val() {
    var input = $("#BP_Sys");

    if (parseInt(input.val()) < 80 || parseInt(input.val()) > 300 )
    {

        if (BP_SysToolTipOn ===1)
        {
            $("#BP_Sys").tooltip("show");
            $("#BP_Sys").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
           /* $("#BP_Sys").prop("disabled",false);
            $("#BP_Sys").focus();*/
            input.prop("disabled", false).focus();
            bySysToolTipOn = 0;
        }
        return false;
    }
    else
    {
        $("#BP_Sys").tooltip("hide");
        $("#BP_Sys").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#BP_Dia").focus().select();
        return true;
    }
}

function BP_Dia_Val() {
    var input = $("#BP_Dia");

    if (parseInt(input.val()) < 50 || parseInt(input.val()) > 180 )
    {

        if (BP_DiaToolTipOn ===1)
        {
            $("#BP_Dia").tooltip("show");
            $("#BP_Dia").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#BP_Dia").prop("disabled",false);
            $("#BP_Dia").focus();
            BP_DiaToolTipOn = 0;
        }
        return false;
    }
    else
    {
        $("#BP_Dia").tooltip("hide");
        $("#BP_Dia").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#TotChol").focus();
        return true;
    }
}

function totChol_Val() {
    var input = $("#TotChol");

    if (parseInt(input.val()) < -1 || parseInt(input.val()) > 500)
    {

        if (totCholToolTipOn === 1)
        {
            $("#TotChol").tooltip("show");
            $("#TotChol").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#TotChol").prop("disabled",false); 
            $("#TotChol").focus();
            totCholToolTipOn = 0;            
        }
        return false;
    }
    else
    {
        $("#TotChol").tooltip("hide");
        $("#TotChol").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        $("#creat").focus().select();
        return true;
    }
}

function creat_Val() {
    var input = $("#creat");
    if (enforceOneDigitTwoDecimal(input.val()) != input.val())
    {
        $("#creat").val(enforceOneDigitTwoDecimal(input.val()));
        $("#creat").focus().select();
        /*if (creatToolTipOn === 1)
            {
                $("#creat").tooltip("show");
                $("#creat").removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#creat").prop("disabled",false); 
                $("#creat").focus();
                creatToolTipOn = 0;            
            }
            return false;*/
    }
    else
    {
        if (input.val() !== "" && (parseFloat(input.val()) < 0.59 || parseFloat(input.val()) > 1.39  ))
        {

            if (creatToolTipOn === 1)
            {
                $("#creat").tooltip("show");
                $("#creat").removeClass("valid").addClass("invalid");
                $("#myForm input").prop("disabled",true);
                $("#myForm button").prop("disabled",true);
                $("#creat").prop("disabled",false); 
                $("#creat").focus().select();
                creatToolTipOn = 0;            
            }
            return false;
        }
        else    
        {
            $("#creat").tooltip("hide");
            $("#creat").removeClass("invalid").addClass("valid");
            $("#myForm input").prop("disabled",false);
            $("#myForm button").prop("disabled",false);
            $("#BMI").focus().select();
            return true;
        }
    }
}
function BMI_Val() {
    var input = $("#BMI");

    if (parseFloat(input.val()) < 12 || parseFloat(input.val()) > 49 || input.val() === "")
    {

        if (BMIToolTipOn === 1)
        {
            $("#BMI").tooltip("show");
            $("#BMI").removeClass("valid").addClass("invalid");
            $("#myForm input").prop("disabled",true);
            $("#myForm button").prop("disabled",true);
            $("#BMI").prop("disabled",false); 
            $("#BMI").focus();
            BMIToolTipOn = 0;            
        }
        return false;
    }
    else
    {
        $("#BMI").tooltip("hide");
        $("#BMI").removeClass("invalid").addClass("valid");
        $("#myForm input").prop("disabled",false);
        $("#myForm button").prop("disabled",false);
        return true;
    }
}