

$(document).ready(function () {
	const form = $('.question').parsley();

	const swiper = new Swiper('.question', {
		spaceBetween: 100,
		allowTouchMove: false,
	});

	const questionSlide = $('.question__answers--inner');
	const loadingEl = $('.question__progress');
	let formStep = 0;
	console.log(questionSlide);

	loadingEl.hide();

	swiper.on('reachEnd', function () {
		$('.question__meta').html('<p><i class="fa fa-lock fa-1x"></i> Your privacy is important to us. By submitting this form, you consent to Belgrave Ventures Pty Ltd and up to 1 Hearing Aid <a href="#" data-toggle="modal" data-target="#basicModal"><span data-toggle="tooltip" title="-- HEARING AID PROVIDERS -- AUDIKA NEW ZEALAND LIMITED Bloom Hearing Specialists New Zealand DILWORTH HEARING LIMITED">supplier</span> </a> contacting you by email, phone calls (including automated calls) and/or SMS via details provided above. I authorize that these marketing communications may be delivered to me using an automatic telephone dialing system or by a prerecorded message even if my number is on the "Do Not Call" list. I understand that my consent is not a condition of purchase and that standard message and data rates may apply. I agree to the <a href="https://www.auditorey.com/legal/page/privacy" target="_blank">Privacy Policy</a><span> and </span><a href="https://www.auditorey.com/legal/page/terms" target="_blank">Terms of Use</a>.</p>');
	});

	$('.btn-check').change(function () {
		slideNext($(this).attr('data-parsley-group'));
	});

	$('.btn-next').click(function () {
		slideNext($(this).attr('id'));
	})

	function slideNext (group) {
		const isValid = form.validate({ group, force: true });
		if (isValid) {
			$(questionSlide[formStep]).fadeOut();
			$(loadingEl[formStep]).fadeIn();
			formStep++;
			setTimeout(() => {
				swiper.slideNext();
			}, 2000);
		}
	}
});