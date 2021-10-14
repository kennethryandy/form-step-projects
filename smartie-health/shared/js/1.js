


$(document).ready(function () {
	$('.custom-radio-button>input[type=radio]').change(function () {
		$(this).parent().addClass('active');
	});
});