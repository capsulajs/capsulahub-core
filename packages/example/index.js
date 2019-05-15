import('http://localhost:3000/services/serviceA.js')
  .then((data) => {
    console.log('data', data);
  })
  .catch((error) => console.log('error', error));
