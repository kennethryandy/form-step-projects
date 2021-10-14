
$(document).ready(function () {
	AOS.init();
	const form = $('.question').parsley();
	const stepWrapper = $('.step-form__wrapper');

	$('input[type=radio]').change(function() {
		const group = $(this).attr('data-parsley-group');
		const isValid = form.validate({group, force: true });
		if(isValid) {
			stepWrapper.attr({'data-aos-delay': '0','data-aos': 'hide-left'});
			setTimeout(() => {
				form.$element.submit();
			}, 900);
		}
	});

	$('#btnContinue').click(function() {
		const group = $($('input[type=text]')[0]).attr('data-parsley-group');
		const isValid = form.validate({group, force: true });
		if(isValid) {
			stepWrapper.attr({'data-aos-delay': '0','data-aos': 'hide-left'});
			setTimeout(() => {
				form.$element.submit();
			}, 900);
		}
	});
});