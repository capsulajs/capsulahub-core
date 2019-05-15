import('http://localhost:3000/services/serviceB.js')
  .then((data) => {
    console.log('data.default', data.default);
    data.default();
  })
  .catch((error) => console.log('error', error));
