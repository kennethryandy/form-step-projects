

$(document).ready(function () {
	const swiper = new Swiper('.question', {
		spaceBetween: 100,
		allowTouchMove: false,
	});

	const questionSlide = $('.question__answers--inner');
	const loadingEl = $('.question__progress');

	loadingEl.hide();

	$('.btn-check').change(function () {
		slideNext();
	});

	$('.btn-next').click(function () {
		slideNext();
	})

	function slideNext () {
		questionSlide.fadeOut();
		loadingEl.fadeIn();
		setTimeout(() => {
			questionSlide.show();
			loadingEl.hide();
			swiper.slideNext();
		}, 2000);
	}
});