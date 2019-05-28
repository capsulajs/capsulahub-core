import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  };
  const images = [
    { src: './images/hardcore.png', appLink: 'http://localhost:7777' },
    { src: './images/devops-02.png', appLink: 'http://localhost:55555' },
    { src: './images/meteor_transperent_sticker-05.png', appLink: 'http://localhost:4444' },
    {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-9fGZGL6K16RDZROu4kfiWMxcldy7tmN8n_NBCT0B8TcxmZnGA',
      appLink: 'http://localhost:8888',
    },
  ];
  return (
    <div style={wrapperStyle}>
      {images.map((image) => (
        <a href={image.appLink}>
          <img width="400" height="400" src={image.src} />
        </a>
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
