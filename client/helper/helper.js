const handleError = (message) => {
  $('#errorMessage').text(message);
  $('#message').animate({ width: 'toggle' }, 350);
};

const redirect = (response) => {
  $('#message').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type,
    url: action,
    data,
    dataType: 'json',
    success,
    error(xhr, status, error) {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};
