

$(document).ready(function () {

	const form = $('.question').parsley({
		errorClass: function () {
			$(this).removeClass('is-valid').addClass('is-invalid');
		},
		successClass: function () {
			$(this).removeClass('is-invalid').addClass('is-valid');
		}
	});

	const progressBar = $('.progbar__percent');
	const questionWrapper = $('.question__item');
	questionWrapper.not('.firstStep').hide();

	let formStep = 0;

	$('.btn-prev').click(function () {
		formStep--;
		updateFormStep();
	});

	$('.btn-next').click(function () {
		if (isValid($(this).attr('id'))) {
			formStep++;
			updateFormStep(true);
		}
	});

	function updateFormStep (next) {
		questionWrapper.fadeOut(500);
		if ($(questionWrapper[formStep]).length === 1) {
			$(questionWrapper[formStep]).delay(500).fadeIn();
			const ariaValueNow = +progressBar.attr('aria-valuenow');
			const newWidth = next ? ariaValueNow + 25 : ariaValueNow - 25;
			progressBar.attr('aria-valuenow', newWidth).css({ width: newWidth + "%" });
		}
	}

	function isValid (group) {
		return form.validate({ group, force: true });
	}


});