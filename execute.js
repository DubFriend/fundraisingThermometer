function init() {
    "use strict";

    function resetLabels() {
        document.getElementById("targetAmountLabel").value = thermometer.get("targetAmountLabel");
        document.getElementById("amountSoFarLabel").value = thermometer.get("amountSoFarLabel");
    }

    function getTarget() {
        return parseFloat(document.getElementById("targetAmount").value);
    }

    function getAmount() {
        return parseFloat(document.getElementById("amountSoFar").value);
    }

    function getColor() {
        return "#" + document.getElementById("jscolor").value;
    }

    function getCurrency() {
        return document.getElementById('currency').value;
    }

    function getTargetAmountLabel() {
        return document.getElementById("targetAmountLabel").value;
    }

    function getAmountSoFarLabel() {
        return document.getElementById("amountSoFarLabel").value;
    }

    function addListeners() {
        var obj1 = document.getElementById('targetAmount');
        obj1.addEventListener('change', function() {
            thermometer.set({ targetAmount: getTarget() });
        }, false);

        var obj2 = document.getElementById('amountSoFar');
        obj2.addEventListener('change', function() {
            thermometer.set({ amountSoFar: getAmount() });
        }, false);

        var obj3 = document.getElementById('currency');
        obj3.addEventListener('change', function() {
             thermometer.set({ currency: getCurrency() });
        }, false);

        var jscolor = document.getElementById('jscolor');
        jscolor.addEventListener('change', function() {
            thermometer.set({ color: getColor() });
        }, false);

        var obj4 = document.getElementById('targetAmountLabel');
        obj4.addEventListener('change', function() {
            thermometer.set({ targetAmountLabel: getTargetAmountLabel() });
        }, false);

        var obj5 = document.getElementById('amountSoFarLabel');
        obj5.addEventListener('change', function() {
            thermometer.set({ amountSoFarLabel: getAmountSoFarLabel() });
        }, false);
    }

    var thermometer = createFundraisingThermometer({
        containerHTMLid: 'canvasDiv',
        width: 180,
        color: getColor(),
        lineColor: "#1B1B1B",
        textColor: "black",
        targetAmount: getTarget(),
        amountSoFar: getAmount(),
        currency: getCurrency()
    });

    thermometer.subscribe("change", resetLabels);

    resetLabels();
    addListeners();
};
