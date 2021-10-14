$(document).ready(function () {
	const loader = $('.question__loader');
	const questionWrapper = $('.question__wrapper');
	loader.hide();
	$('.overlay').hide();
	questionWrapper.not('#firstStep').hide();
	let stepCount = 0;

	$('.radio-check').change(function () {
		$('.radio-btn').removeClass('checked');
		$(this).parent().addClass('checked');
		$('.overlay').show();
	});


	$('.btn-question-nav').click(function () {
		questionWrapper.fadeOut();
		stepCount++;
		$(questionWrapper[stepCount]).delay(600).fadeIn();
		$(questionWrapper[stepCount]).children('.question__inner').hide();
		$('.question__navigation').hide();
		loader.show();

		setTimeout(function () {
			loader.hide();
			$(questionWrapper[stepCount]).children('.question__inner').fadeIn();
			$('.question__navigation').fadeIn();
		}, 3000)

	});


	function updateProgress () {

	}


});