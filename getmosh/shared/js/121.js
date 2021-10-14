

$(document).ready(function () {
	let formStep = 0;
	const questionContainer = $('.question__container');
	const checkBox = $('.btn-checkbox');
	const progressBar = $('.question__progress--bar');
	const progressLabel = $('.question__progress--text>h5');
	const backBtn = $('.question__header--navigation');
	questionContainer.not('#firstStep').hide();
	$('.btn-hidden').hide();

	progressBar.css({ width: (100 / questionContainer.length) + "%" }).attr('aria-valuenow', (100 / questionContainer.length));
	progressLabel.html('1 OF ' + questionContainer.length);

	$('#getStarted').click(function () {
		$('.get-started').css({
			'transform': 'translateX(-100%)',
			'-webkit-transform': 'translateX(-100%)',
			'-moz-transform': 'translateX(-100%)',
			'-ms-transform': 'translateX(-100%)',
			'-o-transform': 'translateX(-100%)',
		});
	});

	$('.question__btn, .question__btn-sqr, .btn-next').click(function () {
		updateStep();
	});

	$('.btn-checkbox').change(function () {
		if ($('.btn-checkbox').is(':checked')) {
			checkBox.not(':checked').prop('disabled', true);
			$('.btn-hidden').fadeIn();
		} else {
			checkBox.prop('disabled', false);
			$('.btn-hidden').fadeOut();
		}
	});

	function updateStep () {
		questionContainer.fadeOut();
		formStep++;
		$(questionContainer[formStep]).fadeIn();
		checkBox.prop('disabled', false);
		updateProgress(true);
		backBtn.removeClass('disabled');
	}

	backBtn.click(function () {
		if (formStep === 0) {
			return
		}
		questionContainer.fadeOut();
		formStep--;
		updateProgress(false);
		$(questionContainer[formStep]).fadeIn();
		if (formStep === 0) {
			backBtn.addClass('disabled')
			return
		}
	});



	function updateProgress (next = false) {
		let widthToAdd = +progressBar.attr('aria-valuenow');
		if (next) {
			widthToAdd += (100 / questionContainer.length);
		} else {
			widthToAdd -= (100 / questionContainer.length);
		}
		progressLabel.html((formStep + 1) + " OF " + questionContainer.length);
		progressBar.css({ width: widthToAdd + "%" }).attr('aria-valuenow', widthToAdd);
	}

});