

$(document).ready(function () {

	const form = $('.question').parsley({
		errorClass: function () {
			$(this).removeClass('is-valid').addClass('is-invalid');
		},
		successClass: function () {
			$(this).removeClass('is-invalid').addClass('is-valid');
		}
	});

	const questionWrapper = $('.paper');
	questionWrapper.not('.firstStep').hide();

	let formStep = 0;

	$('input[type=radio]').change(function () {
		const group = $(this).attr('data-parsley-group');
		if (isValid(group)) {
			formStep++;
			updateFormStep();
		}
	});

	$('.prev-button__btn').click(function () {
		formStep--;
		updateFormStep();
	});

	$('.form-control').keyup(function () {
		const group = $(this).attr('data-parsley-group');
		const btn = $('button#' + group);
		if (form.isValid(group)) {
			btn.prop('disabled', false).removeClass('inactive');
		} else {
			btn.prop('disabled', true).addClass('inactive');
		}
	});

	$('.question__next').click(function () {
		if (isValid($(this).attr('id'))) {
			formStep++;
			updateFormStep();
		}
	});

	function updateFormStep () {
		questionWrapper.fadeOut(500);
		$(questionWrapper[formStep]).delay(500).fadeIn();
	}

	function isValid (group) {
		return form.validate({ group, force: true });
	}



});