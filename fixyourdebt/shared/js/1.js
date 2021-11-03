

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
		console.log(formStep);
		if (formStep === 4) {
			$('.question__meta').html('<p style="font-size:12px;font-style:italic;font-weight:600;margin-bottom:0;text-align:center;"> <i class="fa fa-lock fa-1x"></i> Your privacy is important to us. By submitting this form, you consent to Belgrave Ventures Pty Ltd and up to 1 Hearing Aid <a href="#" data-toggle="modal" data-target="#basicModal"><span data-toggle="tooltip" title="-- HEARING AID PROVIDERS -- AUDIKA NEW ZEALAND LIMITED Bloom Hearing Specialists New Zealand DILWORTH HEARING LIMITED">supplier</span> </a> contacting you by email, phone calls (including automated calls) and/or SMS via details provided above. I authorize that these marketing communications may be delivered to me using an automatic telephone dialing system or by a prerecorded message even if my number is on the "Do Not Call" list. I understand that my consent is not a condition of purchase and that standard message and data rates may apply. I agree to the <a href="https://www.auditorey.com/legal/page/privacy" target="_blank">Privacy Policy</a><span> and </span><a href="https://www.auditorey.com/legal/page/terms" target="_blank">Terms of Use</a>. </p>');
		}
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