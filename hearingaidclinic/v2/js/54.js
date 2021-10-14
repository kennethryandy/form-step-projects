
$(document).ready(function () {
	AOS.init();
	const form = $('.question').parsley();
	const stepWrapper = $('.step-form__wrapper');
	const progressCircle = $('.progress-circle__item');
	const questionItems = $('.question__item');

	let formStepsNum = 0;

	$('input[type=radio]').change(function() {
		const group = $(this).attr('data-parsley-group');
		const isValid = form.validate({group, force: true });
		updateFormStep(isValid);
	});

	$('.btnContinue').click(function() {
		// console.log($(this).parent().children('.text-field').find('input'));
		const group = $('.question__item.active').find('input').attr('data-parsley-group');
		const isValid = form.validate({group, force: true });
		updateFormStep(isValid);
	});


	function updateFormStep(isValid) {
		if(isValid) {
			formStepsNum++;
			if(!$(questionItems[formStepsNum]).length) {
				return form.$element.submit();
			}
			stepWrapper.attr({'data-aos-delay': '0','data-aos': 'hide-left'});
			setTimeout(() => {
				questionItems.removeClass('active');
				stepWrapper.attr({"data-aos":"fade-down", "data-aos-duration":"1000"})
				$(progressCircle[formStepsNum]).addClass('active')
				$(questionItems[formStepsNum]).addClass('active');
			}, 900);
		}
	}


});