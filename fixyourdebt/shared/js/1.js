

$(document).ready(function () {
	const form = $('.question__form').parsley({
		errorClass: function () {
			$(this).removeClass('is-valid').addClass('is-invalid');
		},
		successClass: function () {
			$(this).removeClass('is-invalid').addClass('is-valid');
		}
	});
	const progressBar = $('.progress-bar');
	const questionItem = $('.question__item');
	questionItem.not('.firstStep').hide();
	$('.question').css({ minHeight: $('.question__wrapper').height() + 140 });

	$(window).on('resize', function () {
		$('.question').css({ minHeight: $('.question__wrapper').height() + 140 });
	})

	let formStep = 0;

	$('.option-radio').change(function () {
		if (isValid($(this).attr('data-parsley-group'))) {
			formStep++;
			updateFormStep(true);
		}
	});

	$('.btn-continue').click(function () {
		if (isValid($(this).attr('id'))) {
			formStep++;
			updateFormStep(true);
		}
	});

	function updateFormStep () {
		questionItem.fadeOut(500);
		if ($(questionItem[formStep]).length === 1) {
			$(questionItem[formStep]).delay(500).fadeIn();
			const ariaValueNow = +progressBar.attr('aria-valuenow');
			const newWidth = ariaValueNow + 25;
			progressBar.attr('aria-valuenow', newWidth).css({ width: newWidth + "%" });
		}
	}

	function isValid (group) {
		return form.validate({ group, force: true });
	}
	$("#scrollTo").on('click', function (e) {
		if (this.hash !== "") {
			e.preventDefault();
			const hash = this.hash;

			$('html, body').animate({
				scrollTop: ($(hash).offset().top - 240)
			}, 800, function () {
				window.location.hash = hash;
			});
		}
	});
});