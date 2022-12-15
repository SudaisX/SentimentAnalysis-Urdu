import { useState } from 'react';
import axios from 'axios';
import './bootstrap.min.css';
import './App.css';
import Loader from './Loader';
import { Table } from 'react-bootstrap';

function App() {
    const [loading, setLoading] = useState(false);
    const [textBoxData, setTextBoxData] = useState('');
    const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [positive, setPositive] = useState(0);
    const [negative, setNegative] = useState(0);
    const [neutral, setNeutral] = useState(0);

    const analyse = async (sentences) => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                'http://localhost:8000/analyse',
                { sentences },
                config
            );

            setSentimentAnalysis(data);
            setPositive(data.filter((elem) => elem.sentiment === 0).length);
            setNegative(data.filter((elem) => elem.sentiment === 1).length);
            setNeutral(data.filter((elem) => elem.sentiment === 2).length);

            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(textBoxData.split('\n'));
        await analyse(textBoxData.split('\n'));
    };

    return (
        <>
            <div className='heading'>
                <div className='score' id='score'>
                    Urdu Sentiment Analysis
                </div>
            </div>
            <div className='stats'>
                <div className='accuracy'>
                    <div className='value'>
                        <div>Accuracy:</div> <div>0.54</div>
                    </div>
                    <div className='value'>
                        <div>Precision:</div>{' '}
                        <div>
                            <span className='positive'>0.52</span> |{' '}
                            <span className='negative'>0.69</span> | 0.42
                        </div>
                    </div>
                    <div className='value'>
                        <div>Recall:</div>{' '}
                        <div>
                            <span className='positive'>0.76</span> |{' '}
                            <span className='negative'>0.31</span> | 0.81
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {' '}
                    <div className='container'>
                        <div className='text-display' id='text-display'>
                            Type sentences in urdu below to analyse
                        </div>
                        <textarea
                            id='text-input'
                            className='text-input'
                            cols='30'
                            rows='10'
                            autoFocus
                            dir='rtl'
                            value={textBoxData}
                            onChange={(e) => setTextBoxData(e.target.value)}></textarea>
                        <button className='fancy-btn' onClick={onSubmitHandler}>
                            Analyse
                        </button>
                    </div>
                </>
            )}
            {sentimentAnalysis && (
                <div className='container-result'>
                    <div className='summary'>
                        <div className='positive'>
                            Positive:{' '}
                            {((positive / (positive + neutral + negative)) * 100).toFixed(2)}% (
                            {positive}){' '}
                        </div>
                        <div className='neutral'>
                            Neutral:{' '}
                            {((neutral / (positive + neutral + negative)) * 100).toFixed(2)}% (
                            {neutral}){' '}
                        </div>
                        <div className='negative'>
                            Negative:{' '}
                            {((negative / (positive + neutral + negative)) * 100).toFixed(2)}% (
                            {negative}){' '}
                        </div>
                    </div>
                    <Table responsive style={{ color: '#171717' }}>
                        <thead>
                            <tr>
                                <th>Sentiment</th>
                                <th>Sentence</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '20px' }}>
                            {sentimentAnalysis.map((elem, i) => (
                                <tr key={i}>
                                    <td style={{ fontSize: '40px' }}>
                                        {/* {elem.sentiment} */}
                                        {elem.sentiment === 0
                                            ? '😀'
                                            : elem.sentiment === 1
                                            ? '😠'
                                            : '😐'}
                                    </td>
                                    <td>{elem.sentence}</td>
                                    <td>{i + 1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
            {error && <div className='container-result'>Error</div>}
        </>
    );
}

export default App;
