const api_url = "http://localhost:3000";


function apiGetAllPosts(successCallback, errorCallback,data) {

  axios.get(api_url + `/api/posts/user/all/`, {} )
    .then(successCallback)
    .catch(errorCallback);
}

function apiGetSinglePosts(id,successCallback, errorCallback) {

  axios.get(api_url + `/api/posts/${id}`, {})
    .then(successCallback)
    .catch(errorCallback);
}

function apiInsertPost(data, successCallback, errorCallback) {

    axios.post(api_url + '/api/posts', data )
      .then(successCallback)
      .catch(errorCallback);
}

function apiEditPost(data, successCallback, errorCallback) {

  axios.put(api_url + '/api/posts/', data)
    .then(successCallback)
    .catch(errorCallback);
}

function apiDeletePost(data, successCallback, errorCallback) {

  axios.delete(api_url + `/api/posts/${data.id}`, {} )
    .then(successCallback)
    .catch(errorCallback);
}

function apiGetAllComments(successCallback, errorCallback,data) {

  axios.get(api_url + `/api/comments/posts/${data.id}`, {} )
    .then(successCallback)
    .catch(errorCallback);
}

function apiRegister(data, successCallback, errorCallback) {

    axios.post(api_url + '/api/register', data )
      .then(successCallback)
      .catch(errorCallback);
}

function apiLogin(data, successCallback, errorCallback) {

    axios.post(api_url + '/api/login', data )
    .then(successCallback)
    .catch(errorCallback);
}