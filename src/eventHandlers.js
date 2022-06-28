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
    room.clean();
}

function btnResetEvent() {
    // change all values to default
    routers[0].frequency = Router.LOW_FREQUENCY;
    routers[1].frequency = Router.LOW_FREQUENCY;
    routers[0].powerPct = 1;
    routers[1].powerPct = 1;
    damping = 0.25;
    phaseVelocity = 0.2;
    globalRefractionModifier = 2.5;
    tps = 60;
    stepsPerTick = 1;
    positiveWaveColor = [255, 0, 0];
    negativeWaveColor = [0, 0, 255];
    showSignOnly = false;
    dt = dt_1 / stepsPerTick;
    c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
    // change all controls to default
    document.getElementById("chkFirstRouter").checked = true;
    document.getElementById("chkRouter1Low").checked = true;
    document.getElementById("sldRouter1Power").value = 1;
    document.getElementById("outRouter1Power").value = (1).toFixed(2);
    document.getElementById("sldRouter2Power").value = 1;
    document.getElementById("outRouter2Power").value = (1).toFixed(2);
    document.getElementById("txtRouter1CustomValue").value = 0;
    document.getElementById("chkSecondRouter").checked = false;
    document.getElementById("chkRouter2High").checked = true;
    document.getElementById("txtRouter2CustomValue").value = 0;
    document.getElementById("txtDamping").value = 0.25;
    document.getElementById("txtPhaseVelocity").value = 0.20;
    document.getElementById("txtRefractionModifier").value = 2.5;
    document.getElementById("sldTicksPerSecond").value = 60;
    document.getElementById("outTicksPerSecond").value = 60;
    document.getElementById("sldStepsPerTick").value = 1;
    document.getElementById("outStepsPerTick").value = 1;
    document.getElementById("clrPositiveWave").value = "#ff0000";
    document.getElementById("clrNegativeWave").value = "#0000ff";
    document.getElementById("chkSignOnly").checked = false;
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
    routers[0].frequency = document.getElementById("txtRouter1CustomValue").value;
}

function txtRouter1CustomValueEvent(txt) {
    if (document.getElementById("chkRouter1Custom").checked)
        if (!isNaN(float(txt.value)))
            routers[0].frequency = float(txt.value) * 10;
}

function sldRouter1PowerEvent(sld) {
    routers[0].powerPct = float(sld.value);
    document.getElementById("outRouter1Power").value = float(sld.value).toFixed(2);
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
    routers[1].frequency = document.getElementById("txtRouter2CustomValue").value;
}

function txtRouter2CustomValueEvent(txt) {
    if (document.getElementById("chkRouter2Custom").checked)
        if (!isNaN(float(txt.value)))
            routers[1].frequency = float(txt.value) * 10;
}

function sldRouter2PowerEvent(sld) {
    routers[1].powerPct = float(sld.value);
    document.getElementById("outRouter2Power").value = float(sld.value).toFixed(2);
}

function txtDampingEvent(txt) {
    if (!isNaN(float(txt.value)))
        damping = float(txt.value);
}

function txtPhaseVelocityEvent(txt) {
    if (!isNaN(float(txt.value))) {
        phaseVelocity = float(txt.value);
        c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
    }
}

function txtRefractionModifierEvent(txt) {
    if (!isNaN(float(txt.value)))
        globalRefractionModifier = float(txt.value);
}

function sldTicksPerSecondEvent(sld) {
    tps = sld.value;
    document.getElementById("outTicksPerSecond").value = sld.value;
}

function sldStepsPerTickEvent(sld) {
    stepsPerTick = sld.value;
    document.getElementById("outStepsPerTick").value = sld.value;
    dt = dt_1 / stepsPerTick;
    c2 = phaseVelocity * phaseVelocity * dt * dt / dx / dy;
}

function clrPositiveWave(clr) {
    positiveWaveColor = hexToRgb(clr.value);
}

function clrNegativeWave(clr) {
    negativeWaveColor = hexToRgb(clr.value);
}
