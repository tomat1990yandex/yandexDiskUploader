import React, {useEffect, useState} from 'react';
import axios from "axios";
import '../App.css'

function DiscInfo({token, onResultHandler, onUpdate, onHandleRefresh}) {
  const [items, setItems] = useState([])

  const getDiscInfo = async () => {
    const info = await axios.get(`https://cloud-api.yandex.net/v1/disk/resources?path=/`,
      {headers: {Authorization: token}}).then(res => res.data._embedded.items)
    const fileList = info.map(el => ({name: el.name, path: el.path}))
    setItems(fileList)
    onHandleRefresh(false)
    return fileList
  };

  async function onDownloadFile(name, path) {
    const downloadLink = await axios.get(
      `https://cloud-api.yandex.net/v1/disk/resources/download?path=${path}&fields=href`,
      {headers: {Authorization: token}}).then(res => res.data.href)
    await axios.get(downloadLink, {responseType: 'blob', headers: {Authorization: token}})
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
      });
  }

  async function onDeleteFile(name, path) {
    await axios.delete(
      `https://cloud-api.yandex.net/v1/disk/resources?path=${path}`,
      {headers: {Authorization: token}})
      .then(res => res.status === 204 && onResultHandler(name, 'Успешно удалено!'))
      .catch(err => console.log(err))
    getDiscInfo()
  }

  useEffect(() => {
    getDiscInfo()
  }, [setItems, onUpdate]);

  return (
    <li className="files-list">
      {items.map(el => (<div className="files-container" key={el.path}>
            <label className="table-element">Файл: {el.name}</label>
            <span className="table-element">Путь: {el.path}</span>
            <button className="files-button table-element" onClick={() => onDownloadFile(el.name, el.path)}>Скачать
            </button>
            <button className="files-button table-element" onClick={() => onDeleteFile(el.name, el.path)}>Удалить</button>
          </div>
        )
      )}
    </li>
  )
    ;
}

export default DiscInfo;
