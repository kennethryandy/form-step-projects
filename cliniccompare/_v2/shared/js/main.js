

$(document).ready(function () {
	const progbar = $('.progressbar-visual');
	const form = $('.question').parsley();
	const swiper = new Swiper('.swiper-container', {
		allowTouchMove: false,
		autoHeight: true,
		calculateHeight: true,
		spaceBetween: 120,
		on: {
			init: function () {
				// $('.swiper-navigation__prev').hide();
				$('.swiper-meta>p').css({
					textAlign: 'center'
				});
			}
		}
	});
	swiper.keyboard.disable();
	swiper.mousewheel.disable();
	swiper.on('slideChange', async function () {
		if (swiper.activeIndex === 4) {
			await sleep(2000);
			swiper.slideNext();
			updateProgress();
		}
	});

	swiper.on('reachEnd', function () {
		$('.question__meta').html('<p> <i class="fa fa-lock fa-1x"></i> Your privacy is important to us. By submitting this form, you consent to Belgrave Ventures Pty Ltd and up to 1 Hearing Aid <a href="#" data-toggle="modal" data-target="#basicModal"><span data-toggle="tooltip" title="-- HEARING AID PROVIDERS -- AUDIKA NEW ZEALAND LIMITED Bloom Hearing Specialists New Zealand DILWORTH HEARING LIMITED">supplier</span> </a> contacting you by email, phone calls (including automated calls) and/or SMS via details provided above. I authorize that these marketing communications may be delivered to me using an automatic telephone dialing system or by a prerecorded message even if my number is on the "Do Not Call" list. I understand that my consent is not a condition of purchase and that standard message and data rates may apply. I agree to the <a href="https://www.auditorey.com/legal/page/privacy" target="_blank">Privacy Policy</a><span> and </span><a href="https://www.auditorey.com/legal/page/terms" target="_blank">Terms of Use</a>. </p>');
	});

	$('.custom-input').on('keypress', function (e) {
		if (e.which == 13) {
			e.preventDefault();
			goNext($(this).attr('data-parsley-group'), $(this));
		}
	});

	$('.btn-next').click(function () {
		goNext($(this).attr('id'));
	});

	$('.btn-check[type=radio]').change(function () {
		goNext($(this).attr('data-parsley-group'));
	});

	$('.swiper-navigation__prev').click(function () {
		if (swiper.activeIndex === 5) {
			swiper.slideTo(3)
		} else {
			swiper.slidePrev();
		}
		updateProgress();
	});

	function goNext (group, $el) {
		if (form.validate({ group, force: true })) {
			swiper.slideNext();
			updateProgress();
			if ($el) {
				$el.blur();
			}
		}
		swiper.updateAutoHeight();
	}
	function updateProgress () {
		let newWidth = 0;
		const questionLength = 100 / $('.swiper-slide').length;
		newWidth = questionLength * swiper.activeIndex;
		progbar.css({ width: newWidth + "%" }).attr('aria-valuenow', newWidth);
	}
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
});