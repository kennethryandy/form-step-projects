

$(document).ready(function () {
	const form = $('.question').parsley();
	const colorPickerPreview = $('.color-picker__preview>img');
	const questionWrapper = $('.question__wrapper');
	const questionInner = $('.question__inner');
	$(questionInner[0]).css({ opacity: 1 });

	let formStep = 0;

	$('.btn-color-picker').click(function () {
		$('.btn-color-picker').removeClass('selected');
		$(this).addClass('selected');
		colorPickerPreview.removeClass('selected');
		$('img#' + $(this).attr('id')).addClass('selected');
	});

	$('.btn-check').change(function () {
		updateStep($(this).attr('data-parsley-group'));
	});

	$('.question__next').click(function () {
		updateStep($(this).attr('id'));
	});

	function updateStep (group) {
		const isValid = form.validate({ group, force: true });
		if (isValid) {
			$(questionInner[formStep]).css({ opacity: 0 });
			formStep++;
			questionWrapper.css({ 'margin-left': '-' + formStep + '00%', 'height': $(questionInner[formStep]).height() + 38 });
			$(questionInner[formStep]).css({ opacity: 1 });
			updateProgress();
		}
		return;
	};

	function updateProgress () {
		$(".question__progress--circle.current").addClass('active');
		$(".question__progress--circle.current+div").addClass('current');
	};

});