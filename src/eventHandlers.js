function chkPausedEvent(chk) {
    paused = chk.checked;
}

function chkFirstRouterEvent(chk) {
    routers[0].enabled = chk.checked;
}

function chkSecondRouterEvent(chk) {
    routers[1].enabled = chk.checked;
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
