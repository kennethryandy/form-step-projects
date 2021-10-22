

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