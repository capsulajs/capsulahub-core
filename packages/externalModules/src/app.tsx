import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const images1 = [
    { src: './images/hardcore.png', appLink: 'http://localhost:7777' },
    { src: './images/devops-02.png', appLink: 'http://localhost:55555' },
  ];
  const images2 = [
    { src: './images/meteor_transperent_sticker-05.png', appLink: 'http://localhost:4444' },
    {
      src: './images/panda.jpg',
      appLink: 'http://localhost:8888',
    },
  ];
  return (
    <div style={{ height: '100%' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '100px', marginTop: '85px' }}>
        Capsula Hub Demo
      </h1>
      <div style={wrapperStyle}>
        {images1.map((image) => (
          <div
            style={{
              backgroundColor: 'rgb(145, 145, 145, .4)',
              padding: '30px 0',
              height: '200px',
              width: '550px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          >
            <a style={{ height: '100%' }} href={image.appLink}>
              <img style={{ height: '100%' }} src={image.src} />
            </a>
          </div>
        ))}
      </div>
      <div style={wrapperStyle}>
        {images2.map((image) => (
          <div
            style={{
              backgroundColor: 'rgb(145, 145, 145, .4)',
              padding: '30px 0',
              height: '200px',
              width: '550px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          >
            <a style={{ height: '100%' }} href={image.appLink}>
              <img style={{ height: '100%' }} src={image.src} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
