import React, {useState} from 'react';
import axios from "axios";

function Upload({token, onResultHandler, onQuantity, onHandleRefresh}) {
  const [drag, setDrag] = useState(false)

  function dragStartHandler(event) {
    event.preventDefault()
    setDrag(true)
  }

  function dragLeaveHandler(event) {
    event.preventDefault()
    setDrag(false)
  }

  function onDropHandler(event) {
    event.preventDefault()
    let files = [...event.dataTransfer.files]
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }
    uploadCloudDisk(formData)
    setDrag(false)
  }

  function onInputFileHandler(event) {
    event.preventDefault()
    let files = [...event.target.files]
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }
    uploadCloudDisk(formData)
  }

  async function uploadCloudDisk(formData) {
    let currentIteration = 0
    for (const files of formData) {
      onQuantity({current: currentIteration += 1, total: Array.from(formData.keys()).length})
      const path = encodeURI(files[1].name)
      const requestUploadUrl = await axios.get(
        `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${path}&fields=href`,
        {headers: {Authorization: token}}
      )
        .then(res => res.data.href)
        .catch(err => err.response.status !== 201 && onResultHandler(files[1].name, err.response.data.message))
      await axios.put(requestUploadUrl, files[1])
        .then(res => onResultHandler(files[1].name, res.statusText))
        .catch(err => console.log(err))
      onHandleRefresh(true)
    }
  }

  return (
    <>
      {drag
        ? <div
          onDragStart={event => dragStartHandler(event)}
          onDragLeave={event => dragLeaveHandler(event)}
          onDragOver={event => dragStartHandler(event)}
          onDrop={event => onDropHandler(event)}
          className="drop-area">Отпустите файлы для загрузки</div>
        : <div
          onDragStart={event => dragStartHandler(event)}
          onDragLeave={event => dragLeaveHandler(event)}
          onDragOver={event => dragStartHandler(event)}
          className="drop-area">Перенесите файлы для загрузки или нажмите выбрать файл
          <input
            className="disk__upload-input" multiple={true} type="file"
            onChange={event => onInputFileHandler(event)}/>
        </div>
      }
    </>
  );
}

export default Upload;
