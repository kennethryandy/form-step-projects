$(document).ready(function () {
	const questionWrapper = $('.question__wrapper');
	const form = $('.question').parsley({
		errorClass: function () {
			$(this).removeClass('is-valid').addClass('is-invalid');
		},
		successClass: function () {
			$(this).removeClass('is-invalid').addClass('is-valid');
		}
	});
	const progressLabel = $('.step-value');
	const progressBar = $('.question__progress--bar');
	const progress = $('.question__progress');
	$('.overlay').hide();
	questionWrapper.not('#firstStep').hide();
	let stepCount = 0;
	console.log(progressLabel);

	$('.radio-check, .btn-check').change(function () {
		$('.radio-btn').removeClass('checked');
		$(this).parent().addClass('checked');
		$('.overlay').show();
	});


	$('.btn-question-nav').click(function () {
		const group = $(this).attr('id');
		const isValid = form.validate({ group });
		if (isValid) {
			questionWrapper.fadeOut();
			stepCount++;
			$(questionWrapper[stepCount]).delay(600).fadeIn();
			$(questionWrapper[stepCount]).children('.question__inner').fadeIn();
			if (stepCount === 3) {
				stepCount++;
				setTimeout(function () {
					questionWrapper.fadeOut();
					$(questionWrapper[stepCount]).delay(600).fadeIn();
					$(questionWrapper[stepCount]).children('.question__inner').fadeIn();
				}, 3000);
			}
			updateProgress();
		}

	});


	function updateProgress () {
		progressBar.css({ width: (Math.round(100 * progressBar.width() / progress.width()) + 20) + "%" });
		progressLabel.html(+progressLabel.text() + 1);
	}


});