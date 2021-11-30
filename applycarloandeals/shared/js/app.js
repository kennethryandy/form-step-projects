

(function ($) {
	const owl = $('.owl-carousel').owlCarousel({
		loop: false,
		margin: 10,
		nav: false,
		autoHeight: true,
		items: 1,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		freeDrag: false,
		dots: false,
	});

	const form = $('.question').parsley();

	const progBar = $('.main-form__progress--bar');

	const sleep = async function (ms) {
		return new Promise(function (resolve) { return setTimeout(resolve, ms) });
	}



	owl.on('changed.owl.carousel', async function (e) {
		if ($($('.owl-item')[e.item.index]).find('.question__loading').length !== 0) {
			await sleep(1200);
			owl.trigger('next.owl.carousel');
		}
	})

	$('.btn-check').on('change', slideNext);

	$('.btn-next').on('click', slideNext);

	// $('.form-select.birth').on('change', function () {
	// 	const isEmpty = $('.form-select.birth').filter(function () {
	// 		return this.value !== '';
	// 	});
	// 	if (isEmpty.length === 3) {
	// 		$('.btn-next.hidden').show();
	// 	}
	// });

	function slideNext () {
		const group = $(this).attr('data-parsley-group');
		if (!group && $(this).attr('id') === 'next') {
			owl.trigger('next.owl.carousel');
			const newWidth = +progBar.attr('aria-valuenow') + 20;
			progBar.width(newWidth + "%").attr('aria-valuenow', newWidth);
		} else if (form.validate({ group, force: true })) {
			owl.trigger('next.owl.carousel');
			const newWidth = +progBar.attr('aria-valuenow') + 20;
			progBar.width(newWidth + "%").attr('aria-valuenow', newWidth);
		}
	}

})(jQuery.noConflict())