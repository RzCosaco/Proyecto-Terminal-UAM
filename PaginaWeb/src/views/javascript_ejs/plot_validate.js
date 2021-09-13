var today = new Date();
var date = today.getFullYear() + '-' + (addZ(today.getMonth() + 1)) + '-' + addZ(today.getDate());
$('#sdate').attr("max", date);

if ($('#edate').val() && $('#sdate').val()) {
    $("#edate").prop('disabled', false);
    $('#edate').attr("min", $('#sdate').val());
    $('#edate').attr("max", date);
}
if ($('#sdate').val() && !$('#edate').val()) {
    $("#edate").prop('disabled', false);
    $('#edate').attr("min", $('#sdate').val());
    $('#edate').attr("max", date);
}

if ($('#etime').val() && $('#stime').val()) {
    $('#etime').val('');
    var timecheck = $('#stime').val();
    var timesubs = parseInt(timecheck.substr(0, 2));
    for (let i = timesubs; i < 24; i++) {
        $('#e' + i).prop('disabled', false);
    }
}

if ($('#stime').val() && !$('#etime').val()) {
    $('#etime').val('');
    var timecheck = $('#stime').val();
    var timesubs = parseInt(timecheck.substr(0, 2));
    for (let i = timesubs; i < 24; i++) {
        $('#e' + i).prop('disabled', false);
    }
}

$('#stime').on('change', function (ready) {
    $('#etime').val('');
    for (let j = 0; j < 24; j++) {
        $('#e' + j).prop('disabled', true);
    }
    var timecheck = $('#stime').val();
    var timesubs = parseInt(timecheck.substr(0, 2));
    for (let i = timesubs; i < 24; i++) {
        $('#e' + i).prop('disabled', false);
    }
});

$('#sdate').on('change', function () {
    if ($('#sdate').val().length > 9) {
        $('#edate').prop('disabled', false);
        $('#edate').attr("min", $('#sdate').val());
        $('#edate').attr("max", date);
    } else {
        $('#edate').prop('disabled', true);
    }
});
function addZ(n) {
    return n < 10 ? '0' + n : '' + n;
}