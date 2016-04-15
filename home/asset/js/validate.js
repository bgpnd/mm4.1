var FormForgatPassword = (function(){

	var handleValidation = function(){
		var $form = $('#form_password_forget');

		$form.validate({
			errorElement:'span',
			errorClass:'help-block',
			focusInvalid: false,
			ignore: "",
			rules: {
				'email':{
					required: true,
					email: true
				}
			},
			messages:{
				required: 'Email Harus Di isi',
				email: 'Email Tidak Valid'
			}
		});
	};

	return {
		init: function(){
			handleValidation();
		}
	}

})();


var FormRegister = (function()
{
	var handleValidation = function(){
		var $form = $('#form_register');

		$form.validate({
			errorElement:'span',
			errorClass:'help-block',
			focusInvalid: false,
			ignore: "",
			rules: {
				'firstname':{
					required: true
				},
				'birthdate':{
					required: true
				},
				'email':{
					required: true,
					email: true
				},
				'password':{
					required: true
				},
				'password_confirm':{
					required: true,
					equalTo: '#password'
				}
			 },
			messages:{
				'firstname':{
					required:'Nama Depan Harus Di isi'
				},
				'birthdate':{
					required: 'Tanggal Kelahiran Harus Di isi'
				},
				'email':{
					required: 'Email Harus Di isi',
					email: 'Email Tidak Valid'
				},
				'password':{
					required: 'Password Harus Di isi'
				},
				'password_confirm':{
					required: 'Password Harus Di isi',
					equalTo: 'Password Tidak Sama'
				}
			}
			// highlight: function (element) { // hightlight error inputs
   //                 $(element)
   //                      .closest('.form-group').addClass('has-error'); // set error class to the control group
   //              },
   //          unhighlight: function (element) { // revert the change done by hightlight
   //                  $(element)
   //                      .closest('.form-group').removeClass('has-error'); // set error class to the control group
   //              },
		});
	}

  return {
  	init: function(){
  		handleValidation();
  	}
  }
})();