
$(document).ready(function () {
    setTimeout(function () {
        $("#txtAge").focus().select();
    }, 200);

    loadAvgArray().then(() => {
        console.log(avgLabs["malewhite1"].measure[0]);
    });

    $('#BP_Sys').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (bpSys_Val()) {
                $("#BP_Dia").focus().select();
            }
        }
    });

    $('#BP_Dia').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (bpDia_Val()) {
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
        if (txtAge_Val()) { txtAgeToolTipOn = 1; }
    });

    $("#txtHosp").blur(function () {
        if (txtHosp_Val()) { txtHospToolTipOn = 1; }
    });

    $("#BP_Sys").blur(function () {
        if (bpSys_Val()) { bpSysToolTipOn = 1; }
    });

    $("#BP_Dia").blur(function () {
        if (bpDia_Val()) { bpDiaToolTipOn = 1; }
    });

    $("#TotChol").blur(function () {
        if (totChol_Val()) { totCholToolTipOn = 1; }
    });

    $("#creat").blur(function () {
        if (creat_Val()) { creatToolTipOn = 1; }
    });

    $("#BMI").blur(function () {
        if (BMI_Val()) { BMIToolTipOn = 1; }
    });
});

function bpSys_Val() {
    var input = $("#BP_Sys");
    if (parseInt(input.val()) < 80 || parseInt(input.val()) > 300) {
        $("#BP_Sys").addClass("invalid").removeClass("valid").focus();
        return false;
    } else {
        $("#BP_Sys").addClass("valid").removeClass("invalid");
        return true;
    }
}

function bpDia_Val() {
    var input = $("#BP_Dia");
    if (parseInt(input.val()) < 50 || parseInt(input.val()) > 180) {
        $("#BP_Dia").addClass("invalid").removeClass("valid").focus();
        return false;
    } else {
        $("#BP_Dia").addClass("valid").removeClass("invalid");
        return true;
    }
}

function totChol_Val() {
    var input = $("#TotChol");
    if (parseInt(input.val()) < 0 || parseInt(input.val()) > 500) {
        $("#TotChol").addClass("invalid").removeClass("valid").focus();
        return false;
    } else {
        $("#TotChol").addClass("valid").removeClass("invalid");
        return true;
    }
}

function creat_Val() {
    var input = $("#creat");
    if (input.val() === '' || isNaN(parseFloat(input.val())) || parseFloat(input.val()) < 0.59 || parseFloat(input.val()) > 1.39) {
        $("#creat").addClass("invalid").removeClass("valid").focus();
        return false;
    } else {
        $("#creat").addClass("valid").removeClass("invalid");
        return true;
    }
}

function BMI_Val() {
    var input = $("#BMI");
    if (parseFloat(input.val()) < 12 || parseFloat(input.val()) > 49 || input.val() === "") {
        $("#BMI").addClass("invalid").removeClass("valid").focus();
        return false;
    } else {
        $("#BMI").addClass("valid").removeClass("invalid");
        return true;
    }
}
