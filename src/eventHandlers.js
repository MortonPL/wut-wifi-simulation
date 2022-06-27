function btnPausedEvent(btn) {
    if (paused) {
        paused = false;
        btn.value = "Pause";
    }
    else {
        paused = true;
        btn.value = "Resume";
    }
}

function btnCleanEvent() {
    rooms.forEach(room => room.clean());
}

function btnResetEvent() {
    // change all values to default
    currentFrequency = 0;
    routers[0].frequency = Router.LOW_FREQUENCY;
    routers[0].frequencyIdx = 0;
    routers[1].frequency = Router.LOW_FREQUENCY;
    routers[1].frequencyIdx = 0;
    dampingRatio = 0.25;
    phaseVelocity = 0.2;
    tps = 60;
    stepsPerTick = 1;
    positiveWaveColor = [255, 0, 0];
    negativeWaveColor = [0, 0, 255];
    showSignOnly = false;
    dt = dt_1 / stepsPerTick;
    c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
    // change all controls to default
    document.getElementById("chkFrequencyLow").checked = true;
    document.getElementById("chkFirstRouter").checked = true;
    document.getElementById("chkRouter1Low").checked = true;
    document.getElementById("chkRouter1CustomValue").value = 0;
    document.getElementById("chkSecondRouter").checked = false;
    document.getElementById("chkRouter2Low").checked = true;
    document.getElementById("chkRouter2CustomValue").value = 0;
    document.getElementById("chkDampingRatio").value = 0.25;
    document.getElementById("chkPhaseVelocity").value = 0.20;
    document.getElementById("sldTicksPerSecond").value = 60;
    document.getElementById("sldStepsPerTick").value = 1;
    document.getElementById("clrPositiveWave").value = "#ff0000";
    document.getElementById("clrNegativeWave").value = "#0000ff";
    document.getElementById("chkSignOnly").checked = false;
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
        if (!isNaN(float(txt.value)))
            routers[1].frequency = float(txt.value);
}

function chkDampingRatioEvent(txt) {
    if (!isNaN(float(txt.value)))
        dampingRatio = float(txt.value);
}

function chkPhaseVelocityEvent(txt) {
    if (!isNaN(float(txt.value))) {
        phaseVelocity = float(txt.value);
        c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
    }
}

function sldTicksPerSecondEvent(sld) {
    tps = sld.value;
}

function sldStepsPerTickEvent(sld) {
    stepsPerTick = sld.value;
    dt = dt_1 / stepsPerTick;
    c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
}

function clrPositiveWave(clr) {
    positiveWaveColor = hexToRgb(clr.value);
}

function clrNegativeWave(clr) {
    negativeWaveColor = hexToRgb(clr.value);
}
