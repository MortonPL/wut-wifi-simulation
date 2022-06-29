(function() {
    const routerSettings = [
        {
            enabledCheck: document.getElementById('chkFirstRouter'),
            powerSlider: document.getElementById('sldRouter1Power'),
            powerOut: document.getElementById('outRouter1Power'),
            lowFreqRadio: document.getElementById('chkRouter1Low'),
            highFreqRadio: document.getElementById('chkRouter1High'),
            customFreqRadio: document.getElementById('chkRouter1Custom'),
            customFreqSlider: document.getElementById('sldRouter1CustomValue'),
            customFreqOut: document.getElementById('outRouter1CustomValue')
        },
        {
            enabledCheck: document.getElementById('chkSecondRouter'),
            powerSlider: document.getElementById('sldRouter2Power'),
            powerOut: document.getElementById('outRouter2Power'),
            lowFreqRadio: document.getElementById('chkRouter2Low'),
            highFreqRadio: document.getElementById('chkRouter2High'),
            customFreqRadio: document.getElementById('chkRouter2Custom'),
            customFreqSlider: document.getElementById('sldRouter2CustomValue'),
            customFreqOut: document.getElementById('outRouter2CustomValue')
        }
    ];

    const dampingInput = document.getElementById('numDamping');
    const phaseVelocityInput = document.getElementById('numPhaseVelocity');
    const refractionModifierInput = document.getElementById('numRefractionModifier');
    const tpsSlider = document.getElementById('sldTicksPerSecond');
    const tpsOut = document.getElementById('outTicksPerSecond');
    const stepsPerTickSlider = document.getElementById('sldStepsPerTick');
    const stepsPerTickOut = document.getElementById('outStepsPerTick');
    const positiveWaveColor = document.getElementById('clrPositiveWave');
    const negativeWaveColor = document.getElementById('clrNegativeWave');
    const signOnlyCheck = document.getElementById('chkSignOnly');
    const fileInputDiv = document.getElementById('fileInput');


    /**
     * Check if numeric input element has a valid value.
     * @param {HTMLInputElement} input Numeric input element.
     * @param {Function} converter Converter function for `value` parameter of input.
     */
    const isValueInvalidOrNan = (input, converter) => {
        if (!input.reportValidity())
            return true;
        if (isNaN(converter(input.value)))
            return true;
        return false;
    };

    // set callbacks for router config
    for (let i = 0; i < routerSettings.length; i++) {
        routerSettings[i].enabledCheck.addEventListener('change', evt => routers[i].enabled = evt.target.checked);
        routerSettings[i].powerSlider.addEventListener('input', evt => {
            if (isValueInvalidOrNan(evt.target, float))
                return;
            const newValue = float(evt.target.value);
            routers[i].powerPct = newValue;
            routerSettings[i].powerOut.value = newValue.toFixed(2);
        });
        routerSettings[i].lowFreqRadio.addEventListener('change', () => routers[i].frequency = Router.LOW_FREQUENCY);
        routerSettings[i].highFreqRadio.addEventListener('change', () => routers[i].frequency = Router.HIGH_FREQUENCY);
        routerSettings[i].customFreqRadio.addEventListener('change', () => {
            if (isValueInvalidOrNan(routerSettings[i].customFreqSlider, float))
                return;
            const newValue = float(routerSettings[i].customFreqSlider.value);
            routers[i].frequency = newValue;
        });
        routerSettings[i].customFreqSlider.addEventListener('input', evt => {
            if (isValueInvalidOrNan(evt.target, float))
                return;
            const newValue = float(evt.target.value);
            if (routerSettings[i].customFreqRadio.checked)
                routers[i].frequency = newValue;
            routerSettings[i].customFreqOut.value = newValue.toFixed(2);
        });
    }

    // set callback for physics variables
    signOnlyCheck.addEventListener('change', evt => Room.showSignOnly = evt.target.checked);
    dampingInput.addEventListener('change', evt => {
        if (isValueInvalidOrNan(evt.target, float))
            return;
        const newValue = float(evt.target.value);
        Physics.damping = newValue;
    });
    phaseVelocityInput.addEventListener('change', evt => {
        if (isValueInvalidOrNan(evt.target, float))
            return;
        const newValue = float(evt.target.value);
        Physics.phaseVelocity = newValue;
    });
    refractionModifierInput.addEventListener('change', evt => {
        if (isValueInvalidOrNan(evt.target, float))
            return;
        const newValue = float(evt.target.value);
        Physics.globalRefractionModifier = newValue;
    });
    tpsSlider.addEventListener('input', evt => {
        if (isValueInvalidOrNan(evt.target, int))
            return;
        const newValue = int(evt.target.value);
        Physics.tps = newValue;
        tpsOut.value = newValue.toString();
    });
    stepsPerTickSlider.addEventListener('input', evt => {
        if (isValueInvalidOrNan(evt.target, int))
            return;
        const newValue = int(evt.target.value);
        Physics.stepsPerTick = newValue;
        stepsPerTickOut.value = newValue.toString();
        room.clean();
    });
    positiveWaveColor.addEventListener('input', evt => {
        const newValue = hexToRgb(evt.target.value);
        Room.positiveWaveColor = newValue;
    });
    negativeWaveColor.addEventListener('input', evt => {
        const newValue = hexToRgb(evt.target.value);
        Room.negativeWaveColor = newValue;
    });

    // set callbacks for buttons
    document.getElementById('btnPaused').addEventListener('click', evt => {
        paused = !paused;
        evt.target.value = paused ? 'Resume' : 'Pause';
    });
    document.getElementById('btnClean').addEventListener('click',
        () => room.clean());
    document.getElementById('btnReset').addEventListener('click', () => {
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
    });
    document.getElementById('btnLoadFile').addEventListener('click',
        () => fileInputDiv.getElementsByTagName('input')[0].click());
})();
