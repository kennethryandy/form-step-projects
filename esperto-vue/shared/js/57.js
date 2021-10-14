
$(document).ready(function () {

	const form = $("#app").parsley();


	const app = new Vue({
		el: "#app",
		data: {
			step: 1
		},
		methods: {
			goNext (e) {
				console.log(e);
				const group = $(e.srcElement).attr('data-parsley-group');
				const isValid = form.validate({ group, force: true });
				if (isValid) {
					this.step++;
				}
			},
		},
		mounted () {
			this.step = 1;
		}
	});




});