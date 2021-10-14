

$(document).ready(function () {
	AOS.init();

	$('.text-field').css({ height: $('input[type=text]').height() });

	$("button[id=start]").click(function () {
		formWrapper.css({ opacity: 1 }).fadeIn();
	});

	const form = $('.question').parsley();
	const formWrapper = $('.form-wrapper');
	const questionWrapper = $('.question__item');
	const progressBar = $('.form-wrapper__progress-bar').children();
	const nextButton = $('.question__next').not(':button[type=submit]');
	let formSteps = 0;
	questionWrapper.not('.firstStep').hide();
	formWrapper.hide();



	$('input[type=radio]').change(function () {
		const isValid = validateGroup($(this).attr('data-parsley-group'));
		if (isValid) {
			updateNextStep();
		}
	});

	nextButton.click(function () {
		const isValid = validateGroup($(this).attr('id'));
		if (isValid) {
			updateNextStep();
		}
	});

	function updateNextStep () {
		questionWrapper.fadeOut(250);
		$(questionWrapper[formSteps]).delay(250).fadeIn();
		$(progressBar[formSteps]).addClass('active');
	}


	function validateGroup (group) {
		const isValid = form.validate({ group, force: true });
		if (isValid) {
			formSteps++;
		}
		return isValid;
	}

});