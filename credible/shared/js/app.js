

(function () {
	const form = $('.question').parsley();
	const progBar = $('.progress-step__bar');
	const stepper = $('.stepper');
	const questionStep = $('.question__step');
	questionStep.not('.firstStep').hide();

	let stepForm = 0;

	$('.input-dollar').on('keyup', function (e) {
		if (e.keyCode === 8 && $(this).val() === '$') {
			$(this).val('');
		} else if ($(this).val() && $(this).val().length === 1) {
			$(this).val('$' + $(this).val());
		}
	});

	$('.btn-check').on('change', function () {
		const isValid = form.validate({ group: $(this).attr('data-parsley-group'), force: true });
		$(this).next().addClass('active').children('i').removeClass('fa-chevron-right').addClass('fa-check-circle')
		if (isValid) {
			updateStep();
		}
	});

	$('.form-control').on('change', function () {
		if ($(this).val()) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});

	$('.btn-next').on('click', function () {
		const isValid = form.validate({ group: $(this).attr('id'), force: true });
		if (isValid) {
			updateStep();
		}

		return
	})

	function updateStep () {
		stepper.removeClass('step-' + stepForm);
		$(questionStep[stepForm]).fadeOut();
		stepForm++;
		$(questionStep[stepForm]).fadeIn(1600);
		const newWidth = +progBar.attr('data-current-value') + 16.6666666667;
		progBar.css({ 'width': newWidth + "%" }).attr('data-current-value', newWidth);
		stepper.addClass('step-' + stepForm).delay(300).queue(function (next) {
			$('.stepper__item.active').next().addClass('active')
			next();
		});

	}


})();