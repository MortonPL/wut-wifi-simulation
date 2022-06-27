function chkPausedEvent(chk) {
    paused = chk.checked;
}

function btnCleanEvent() {
    room.clean();
}

function chkRouter1EnabledEvent(chk) {
    routers[0].enabled = chk.checked;
}

function chkRouter1LowEvent(chk) {
    routers[0].frequency = Router.LOW_FREQUENCY;
}

function chkRouter1HighEvent(chk) {
    routers[0].frequency = Router.HIGH_FREQUENCY;
}

function chkRouter1CustomEvent(chk) {
    routers[0].frequency = document.getElementById("chkRouter1CustomValue").value;
}

function chkRouter1CustomValueEvent(txt) {
    if (document.getElementById("chkRouter1Custom").checked)
        if (!isNaN(float(txt.value)))
            routers[0].frequency = float(txt.value) * 1e9;
}

function chkSignOnlyEvent(chk) {
    showSignOnly = chk.checked;
}

function chkRouter2EnabledEvent(chk) {
    routers[1].enabled = chk.checked;
}

function chkRouter2LowEvent(chk) {
    routers[1].frequency = Router.LOW_FREQUENCY;
}

function chkRouter2HighEvent(chk) {
    routers[1].frequency = Router.HIGH_FREQUENCY;
}

function chkRouter2CustomEvent(chk) {
    routers[1].frequency = document.getElementById("chkRouter2CustomValue").value;
}

function chkRouter2CustomValueEvent(txt) {
    if (document.getElementById("chkRouter2Custom").checked)
        routers[1].frequency = float(txt.value) * 1e9;
}

function sldTicksPerSecondEvent(sld) {
    tps = sld.value;
}

function sldStepsPerTickEvent(sld) {
    stepsPerTick = sld.value;
}

function clrPositiveWave(clr) {
    positiveWaveColor = hexToRgb(clr.value);
}

function clrNegativeWave(clr) {
    negativeWaveColor = hexToRgb(clr.value);
}
