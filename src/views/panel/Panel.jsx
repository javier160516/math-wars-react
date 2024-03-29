import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/panel/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { convertCharCode } from '../../helpers/ResetOptions';

const Panel = () => {
  const [problemas, setProblemas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [charCode, setCharCode] = useState(97);

  axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'any value';

  useEffect(() => {
    getProblemas();
  }, [])

  const getProblemas = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND}/panel`;

      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/panel`, {
        headers: {
          'Access-Control-Allow-Origin': `${import.meta.env.VITE_BACKEND}`,
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Methods': 'GET',
          'Accept': 'application/json, */*',
        }
      });

      const problemasArray = [];
      if (response.status == 200) {
        let newArray = [];
        response.data.data.map(problema => {
          problemasArray.push({ ...problemas, id: problema.id, planteamiento: problema.planteamiento, opciones: JSON.parse(problema.respuestas), respuesta: problema.opcion })
        })
        setProblemas(problemasArray);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const eliminarProblema = async (id) => {
    event.preventDefault();
    Swal.fire({
      title: '¿Desea eliminar este problema?',
      icon: 'question',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#166534',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#991b1b'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_BACKEND}/eliminar-ejercicio/${id}`);
          if (response.status == 200) {
            Swal.fire({
              title: response.data.msg,
              icon: 'success'
            }).then(result => {
              if (result.isConfirmed) {
                setProblemas([]);
                getProblemas();
              }
            });
          }
        } catch (error) {
          Swal.fire({
            title: error.response.data.msg,
            icon: 'error'
          }).then(result => {
            if (result.isConfirmed) {
              setProblemas([]);
              getProblemas();
            }
          })
        }
      }
    });
  }

  return (
    <div className='bg-gray-100'>
      <Header />
      <div>
        <h2 className='text-3xl font-bold text-center my-5 uppercase'>Preguntas</h2>
        <div className='flex flex-wrap w-width_90 mx-auto gap-3 my-3'>
          {problemas.map((problema, key) => (
            <div className='w-11/12 md:w-5/12 px-6 py-4 mb-5 mx-auto bg-white border rounded-md shadow-md' key={key}>
              <div className='flex justify-between items-center'>
                <h2>
                  <span className='font-bold'>Problema:</span> {problema.planteamiento}
                </h2>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className='hover:cursor-pointer text-red-700 text-lg'
                  onClick={() => eliminarProblema(problema.id)}
                />
              </div>
              <div className="w-full md:flex gap-2 items-center justify-between mt-3 flex-wrap">
                {problema.opciones.map((opcion, key) => (
                  <div key={key} className='my-3 md:my-0'>
                    <MathJaxContext>
                      <div className='flex items-center'>
                        <span className='font-bold mr-3'>
                          {`${convertCharCode(charCode + key)})`}
                        </span>
                        <MathJax className='my-5 mx-auto'>{opcion != '' ? `\\(${opcion}\\)` : ''}</MathJax>
                      </div>
                    </MathJaxContext>
                    {/* <img src={`${import.meta.env.VITE_BACKEND}/${imagen}`} alt="imagen" width={300} loading='lazy' /> */}
                  </div>
                ))}
              </div>
              <div className='mt-3 font-bold'>
                Respuesta Correcta: <span className='font-normal'>{convertCharCode(charCode + problema.respuesta)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Panel