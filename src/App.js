import { useState, useEffect, useCallback } from 'react'
import Pusher from 'pusher-js'
import ReactLoading from 'react-loading';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import axios from 'axios'

import './styles.css'


const CURRENT_TARGET = 30

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [value, setValue] = useState(100)
  const [valueLabel, setValueLabel] = useState(30)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pusher = new Pusher('ab38e09546243c067a0c', {
      cluster: 'sa1',
    });

    const channel = pusher.subscribe("stopwatch")

    channel.bind("time", data => {
      setValue((data.remainingTime / CURRENT_TARGET) * 100)
      setValueLabel(data.remainingTime)
      setLoading(!!data.remainingTime)
    })

    return (() => {
      pusher.unsubscribe("stopwatch")
    })
  }, [])

  return (
    <div className='container'>
      <CircularProgressbar
        value={value}
        text={valueLabel}
        strokeWidth={2}
        styles={buildStyles({
          path: {
            // Path color
            stroke: `rgba(62, 152, 199, ${value / 100})`,
          },
        })}
      />
      <button
        className={!loading ? "enable" : "disable"}
        disabled={loading}
        onClick={async (e) => {
          await axios.post("http://localhost:5000/timer", { seconds: 30 })
          // sleep(CURRENT_TARGET)

        }}>
        {!loading ? 'Start' : <ReactLoading type='spokes' className='spin' />}
      </button>
    </div>
  );
}

export default App;
