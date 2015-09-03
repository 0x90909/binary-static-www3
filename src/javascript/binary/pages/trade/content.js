var Content = (function () {
    'use strict';

    var localize = {};

    var populate = function () {

        localize =  {
            textStartTime: text.localize('Start time'),
            textSpot: text.localize('Spot'),
            textBarrier: text.localize('Barrier'),
            textBarrierOffset: text.localize('Barrier offset'),
            textHighBarrier: text.localize('High barrier'),
            textHighBarrierOffset: text.localize('High barrier offset'),
            textLowBarrier: text.localize('Low barrier'),
            textLowBarrierOffset: text.localize('Low barrier offset'),
            textPayout: text.localize('Payout'),
            textStake: text.localize('Stake'),
            textPurchase: text.localize('Purchase'),
            textDuration: text.localize('Durations'),
            textEndTime: text.localize('End Time'),
            textMinDuration: text.localize('min'),
            textMinDurationTooltip: text.localize('minimum available duration'),
            textBarrierOffsetTooltip: text.localize("Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received"),
            textDurationSeconds: text.localize('seconds'),
            textDurationMinutes: text.localize('minutes'),
            textDurationHours: text.localize('hours'),
            textDurationDays: text.localize('days'),
            textDurationTicks: text.localize('ticks'),
            textNetProfit: text.localize('Net profit'),
            textReturn: text.localize('Return'),
            textNow: text.localize('Now'),
        };

        var starTime = document.getElementById('start_time_label');
        if (starTime) {
            starTime.textContent = localize.textStartTime;
        }

        var minDurationTooltip = document.getElementById('duration_tooltip');
        if (minDurationTooltip) {
            minDurationTooltip.textContent = localize.textMinDuration;
            minDurationTooltip.setAttribute('title', localize.textMinDurationTooltip);
        }

        var spotLabel = document.getElementById('spot_label');
        if (spotLabel) {
            spotLabel.textContent = localize.textSpot;
        }

        var barrierTooltip = document.getElementById('barrier_tooltip');
        if (barrierTooltip) {
            barrierTooltip.textContent = localize.textBarrierOffset;
            barrierTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }

        var barrierHighTooltip = document.getElementById('barrier_high_tooltip');
        if (barrierHighTooltip) {
            barrierHighTooltip.textContent = localize.textHighBarrierOffset;
            barrierHighTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }

        var barrierLowTooltip = document.getElementById('barrier_low_tooltip');
        if (barrierLowTooltip) {
            barrierLowTooltip.textContent = localize.textLowBarrierOffset;
            barrierLowTooltip.setAttribute('title', localize.textBarrierOffsetTooltip);
        }

        var payoutOption = document.getElementById('payout_option');
        if (payoutOption) {
            payoutOption.textContent = localize.textPayout;
        }

        var stakeOption = document.getElementById('stake_option');
        if (stakeOption) {
            stakeOption.textContent = localize.textStake;
        }

        var purchaseButtonTop = document.getElementById('purchase_button_top');
        if (purchaseButtonTop) {
            purchaseButtonTop.textContent = localize.textPurchase;
        }

        var purchaseButtonBottom = document.getElementById('purchase_button_bottom');
        if (purchaseButtonBottom) {
            purchaseButtonBottom.textContent = localize.textPurchase;
        }
    };

    return {
        localize: function () { return localize; },
        populate: populate
    };

})();
