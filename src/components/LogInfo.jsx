import React from 'react';
import '../App.css'

function LogInfo({log, quantity}) {
  const logList = (arr) => {
    return (arr.map(el =>
      <div style={{display: "flex"}} key={el.name+el.status}>
        <p className="log-element">Имя файла: {el.name}</p>
        <p className="log-element">Статус: {el.status}</p>
      </div>
    ))
  }

  return (
    <>
      <span style={{fontSize: 20}}>Номер текущего файла: {quantity.current || 0} Всего файлов:{quantity.total || 0}</span>
      <li className="log-list">{logList(log)}</li>
    </>
  );
}

export default LogInfo;
