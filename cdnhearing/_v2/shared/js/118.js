

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