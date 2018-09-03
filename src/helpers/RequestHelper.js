const RequestHelper = () => {
  this.url = `http://localhost:8080`;
  this.fetchConvert = fetchConvert;
  this.postConvert = postConvert;
}

RequestHelper.prototype = {
  getAllPlayers: () => this.fetchConvert(`${this.url}/game/players/`),
  createNewPlayer: (player) => this.postConvert(`${this.url}/game/players/`, player)
};

const fetchConvert = url => {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
  }).then(res => res.json())
};

const postConvert = (url, postItem) => {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: `${postItem}`,
    })
  }).then(res => res.json())
};

export default RequestHelper;
