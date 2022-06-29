const routerSettings = [
    {
        enabledCheck: document.getElementById("chkFirstRouter"),
        powerSlider: document.getElementById("sldRouter1Power"),
        powerOut: document.getElementById("outRouter1Power"),
        lowFreqRadio: document.getElementById("chkRouter1Low"),
        highFreqRadio: document.getElementById("chkRouter1High"),
        customFreqRadio: document.getElementById("chkRouter1Custom"),
        customFreqSlider: document.getElementById("sldRouter1CustomValue"),
        customFreqOut: document.getElementById("outRouter1CustomValue")
    },
    {
        enabledCheck: document.getElementById("chkSecondRouter"),
        powerSlider: document.getElementById("sldRouter2Power"),
        powerOut: document.getElementById("outRouter2Power"),
        lowFreqRadio: document.getElementById("chkRouter2Low"),
        highFreqRadio: document.getElementById("chkRouter2High"),
        customFreqRadio: document.getElementById("chkRouter2Custom"),
        customFreqSlider: document.getElementById("sldRouter2CustomValue"),
        customFreqOut: document.getElementById("outRouter2CustomValue")
    }
];
const dampingInput = document.getElementById("numDamping");
const phaseVelocityInput = document.getElementById("numPhaseVelocity");
const refractionModifierInput = document.getElementById("numRefractionModifier");
const tpsSlider = document.getElementById("sldTicksPerSecond");
const tpsOut = document.getElementById("outTicksPerSecond");
const stepsPerTickSlider = document.getElementById("sldStepsPerTick");
const stepsPerTickOut = document.getElementById("outStepsPerTick");
const positiveWaveColor = document.getElementById("clrPositiveWave");
const negativeWaveColor = document.getElementById("clrNegativeWave");
const signOnlyCheck = document.getElementById("chkSignOnly");

function btnPausedEvent(btn) {
    paused = !paused;
    btn.value = paused ? "Resume" : "Pause";
}

function btnCleanEvent() {
    room.clean();
}

function btnResetEvent() {
    // change all controls to default
    routerSettings[0].enabledCheck.checked = true;
    routerSettings[0].lowFreqRadio.checked = true;
    routerSettings[0].powerSlider.value = routerSettings[0].powerSlider.defaultValue;
    routerSettings[0].customFreqSlider.value = routerSettings[0].customFreqSlider.defaultValue;
    routerSettings[1].enabledCheck.checked = false;
    routerSettings[1].highFreqRadio.checked = true;
    routerSettings[1].powerSlider.value = routerSettings[1].powerSlider.defaultValue;
    routerSettings[1].customFreqSlider.value = routerSettings[1].customFreqSlider.defaultValue;
    dampingInput.value = dampingInput.defaultValue;
    phaseVelocityInput.value = phaseVelocityInput.defaultValue;
    refractionModifierInput.value = refractionModifierInput.defaultValue;
    tpsSlider.value = tpsSlider.defaultValue;
    stepsPerTickSlider.value = stepsPerTickSlider.defaultValue;
    positiveWaveColor.value = positiveWaveColor.defaultValue;
    negativeWaveColor.value = negativeWaveColor.defaultValue;
    signOnlyCheck.checked = false;

    // dispatch events in order to update simulation variables
    routerSettings[0].enabledCheck.dispatchEvent(new Event('change'));
    routerSettings[0].lowFreqRadio.dispatchEvent(new Event('change'));
    routerSettings[0].powerSlider.dispatchEvent(new Event('input'));
    routerSettings[0].customFreqSlider.dispatchEvent(new Event('input'));
    routerSettings[1].enabledCheck.dispatchEvent(new Event('change'));
    routerSettings[1].highFreqRadio.dispatchEvent(new Event('change'));
    routerSettings[1].powerSlider.dispatchEvent(new Event('input'));
    routerSettings[1].customFreqSlider.dispatchEvent(new Event('input'));
    dampingInput.dispatchEvent(new Event('change'));
    phaseVelocityInput.dispatchEvent(new Event('change'));
    refractionModifierInput.dispatchEvent(new Event('change'));
    tpsSlider.dispatchEvent(new Event('input'));
    stepsPerTickSlider.dispatchEvent(new Event('input'));
    positiveWaveColor.dispatchEvent(new Event('input'));
    negativeWaveColor.dispatchEvent(new Event('input'));
    signOnlyCheck.dispatchEvent(new Event('change'));
}

function chkRouterEnabledEvent(chk, index) {
    routers[index].enabled = chk.checked;
}

function chkRouterLowEvent(index) {
    routers[index].frequency = Router.LOW_FREQUENCY;
}

function chkRouterHighEvent(index) {
    routers[index].frequency = Router.HIGH_FREQUENCY;
}

function chkRouterCustomEvent(index) {
    routers[index].frequency = float(routerSettings[index].customFreqSlider.value);
}

function sldRouterCustomValueEvent(sld, index) {
    if (routerSettings[index].customFreqRadio.checked)
        routers[index].frequency = float(sld.value);
    routerSettings[index].customFreqOut.value = float(sld.value).toFixed(2);
}

function sldRouterPowerEvent(sld, index) {
    routers[index].powerPct = float(sld.value);
    routerSettings[index].powerOut.value = float(sld.value).toFixed(2);
}

function chkSignOnlyEvent(chk) {
    Room.showSignOnly = chk.checked;
}

function numDampingEvent(num) {
    if (!isNaN(float(num.value)))
        Physics.damping = float(num.value);
}

function numPhaseVelocityEvent(num) {
    if (!isNaN(float(num.value)))
        Physics.phaseVelocity = float(num.value);
}

function numRefractionModifierEvent(num) {
    if (!isNaN(float(num.value)))
        Physics.globalRefractionModifier = float(num.value);
}

function sldTicksPerSecondEvent(sld) {
    Physics.tps = int(sld.value);
    tpsOut.value = int(sld.value).toString();
}

function sldStepsPerTickEvent(sld) {
    Physics.stepsPerTick = int(sld.value);
    stepsPerTickOut.value = int(sld.value).toString();
}

function clrPositiveWave(clr) {
    Room.positiveWaveColor = hexToRgb(clr.value);
}

function clrNegativeWave(clr) {
    Room.negativeWaveColor = hexToRgb(clr.value);
}
