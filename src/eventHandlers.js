function chkPausedEvent(chk) {
    paused = chk.checked;
}

function btnCleanEvent() {
    rooms.forEach(room => room.clean());
}

function chkFrequencyLowEvent(chk) {
    currentFrequency = 0;
}

function chkFrequencyHighEvent(chk) {
    currentFrequency = 1;
}

function chkFrequencyCustomEvent(chk) {
    currentFrequency = 2;
}

function chkRouter1EnabledEvent(chk) {
    routers[0].enabled = chk.checked;
}

function chkRouter1LowEvent(chk) {
    routers[0].frequency = Router.LOW_FREQUENCY;
    routers[0].frequencyIdx = 0;
}

function chkRouter1HighEvent(chk) {
    routers[0].frequency = Router.HIGH_FREQUENCY;
    routers[0].frequencyIdx = 1;
}

function chkRouter1CustomEvent(chk) {
    routers[0].frequency = document.getElementById("chkRouter1CustomValue").value;
    routers[0].frequencyIdx = 2;
}

function chkRouter1CustomValueEvent(txt) {
    if (document.getElementById("chkRouter1Custom").checked)
        if (!isNaN(float(txt.value)))
            routers[0].frequency = float(txt.value);
}

function chkSignOnlyEvent(chk) {
    showSignOnly = chk.checked;
}

function chkRouter2EnabledEvent(chk) {
    routers[1].enabled = chk.checked;
}

function chkRouter2LowEvent(chk) {
    routers[1].frequency = Router.LOW_FREQUENCY;
    routers[1].frequencyIdx = 0;
}

function chkRouter2HighEvent(chk) {
    routers[1].frequency = Router.HIGH_FREQUENCY;
    routers[1].frequencyIdx = 1;
}

function chkRouter2CustomEvent(chk) {
    routers[1].frequency = document.getElementById("chkRouter2CustomValue").value;
    routers[1].frequencyIdx = 2;
}

function chkRouter2CustomValueEvent(txt) {
    if (document.getElementById("chkRouter2Custom").checked)
        routers[1].frequency = float(txt.value);
}

function sldTicksPerSecondEvent(sld) {
    tps = sld.value;
}

function sldStepsPerTickEvent(sld) {
    stepsPerTick = sld.value;
    dt = dt_1 / stepsPerTick;
    c2 = PHASE_VELOCITY * PHASE_VELOCITY * dt * dt / dx / dy;
    console.log(dt); // DEBUG
    console.log(c2); // DEBUG
}

function clrPositiveWave(clr) {
    positiveWaveColor = hexToRgb(clr.value);
}

function clrNegativeWave(clr) {
    negativeWaveColor = hexToRgb(clr.value);
}
