

$(document).ready(function () {

	const formInstance = $("#page-form").parsley();
	const progressBar = $('.progress>.progress-bar');
	if ($(this).width() <= 768) {
		removeLgClassOnTextfield();
	}

	$(window).on('resize', function () {
		if ($(this).width() <= 768) {
			removeLgClassOnTextfield();
		}
	})

	const swiper = new Swiper('.swiper-container', {
		allowTouchMove: false,
		autoHeight: true,
		calculateHeight: true,
		spaceBetween: 90,
		on: {
			init: function () {
				$('.swiper-navigation__prev').hide();
				$('.swiper-meta>p').css({ textAlign: 'center' });
			}
		}
	});

	swiper.keyboard.disable();
	swiper.mousewheel.disable();


	swiper.on('slideChange', async function () {
		if (this.activeIndex === 4) {
			$('.swiper-navigation__prev').hide();
			$('.swiper-meta>p').css({ textAlign: 'center' });
			$('.swiper-navigation__next').hide();
			// Dummy Getting Data
			// Real Ajax call goes below.
			await sleep(2000);
			// 
			swiper.slideNext();
		} else if (this.activeIndex !== 6 || this.activeIndex !== 0) {
			$('.swiper-navigation__prev').show();
			$('.swiper-navigation__next').show().html('Continue');
			$('.swiper-meta>p').css({ textAlign: 'right' });
		}
	});

	swiper.on('reachEnd', function () {
		$('.swiper-navigation__next').html('Submit');
		$('.swiper-meta').html('<p style="font-size:12px;color:gray;margin-top:32px;"> <i class="fa fa-lock fa-1x"></i> Your privacy is important to us. By submitting this form, you consent to Belgrave Ventures Pty Ltd and up to 1 Hearing Aid <a href="#" data-toggle="modal" data-target="#basicModal"><span data-toggle="tooltip" title="-- HEARING AID PROVIDERS -- AUDIKA NEW ZEALAND LIMITED Bloom Hearing Specialists New Zealand DILWORTH HEARING LIMITED">supplier</span> </a> contacting you by email, phone calls (including automated calls) and/or SMS via details provided above. I authorize that these marketing communications may be delivered to me using an automatic telephone dialing system or by a prerecorded message even if my number is on the "Do Not Call" list. I understand that my consent is not a condition of purchase and that standard message and data rates may apply. I agree to the <a href="https://www.auditorey.com/legal/page/privacy" target="_blank">Privacy Policy</a><span> and </span><a href="https://www.auditorey.com/legal/page/terms" target="_blank">Terms of Use</a>. </p>');
	})

	swiper.on('reachBeginning', function () {
		$('.swiper-navigation__prev').hide();
	})

	$('.swiper-navigation__prev').click(function () {
		if (swiper.activeIndex === 5) {
			swiper.slideTo(3);
			return;
		}
		swiper.slidePrev();
	});


	$('input[type=radio]').change(function () {
		if (formInstance.isValid({ group: this.name, force: true })) {
			if (!$('input[name=' + this.name + ']').hasClass('active')) {
				const width = (+progressBar[0].style.width.split('%')[0] + 20).toString();
				progressBar.attr('aria-valuenow', width).css({ width: width + "%" });
				$('.progress-text').html('Progress ' + width + "%");
			}
			$('input[name=' + this.name + ']').removeClass('active');
			$(this).addClass('active');
			swiper.slideNext();
		}
	})

	$('.swiper-navigation__next').click(goNext);
	async function goNext () {
		const byName = $(".swiper-slide-active").find('input')[0].name;
		const byGroup = $(".swiper-slide-active").find('input:first').attr('data-parsley-group');
		const byType = $(".swiper-slide-active").find('input')[0].type;
		formInstance.validate({ group: byGroup });

		if (formInstance.isValid({ group: byGroup })) {
			if (swiper.activeIndex === 4) {
				// Dummy Getting Data
				// Real Ajax call goes below.
				await sleep(2000);
				// 
			}
			if (!$('input[name=' + byName + ']').hasClass('active')) {
				const width = (+progressBar[0].style.width.split('%')[0] + 20).toString();
				progressBar.attr('aria-valuenow', width).css({ width: width + "%" });
				$('.progress-text').html('Progress ' + width + "%");
			}
			if (byType === 'text') {
				$('input[name=' + byName + ']').addClass('active')
			}
			$('.swiper-meta>p').css({ textAlign: 'right' });

			swiper.slideNext();
		}

		if (swiper.activeIndex === 6 && formInstance.isValid()) {
			$("#page-form").submit();
		}
		swiper.updateAutoHeight(200)
	}

	function removeLgClassOnTextfield () {
		$('input.lg, label.lg').removeClass('lg');
	}

	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
});