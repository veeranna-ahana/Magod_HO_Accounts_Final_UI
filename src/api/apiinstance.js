export const getRequest = async (url, callback) => {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let content = await response.json();
    callback(content);
  };
  
  export const postRequest = async (url, body, callback) => {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let content = await response.json();
    callback(content);
  };
  
  export const postRequestFormData = async (url, data, callback) => {
    console.log("data in paiinstance",data  , "urlllll", url);
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
        // 'Content-Type': 'multipart/form-data'
      },
      body: data,
    });
    console.log("response in paiinstance",response);
    callback(response);
  };
  