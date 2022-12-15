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
            <div className='stats'>
                <div className='score' id='score'>
                    Urdu Sentiment Analysis
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
                        <div className='positive'>Positive: {positive} </div>
                        <div className='neutral'>Neutral: {neutral} </div>
                        <div className='negative'>Negative: {negative} </div>
                    </div>
                    <Table responsive style={{ color: '#171717' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Sentence</th>
                                <th>Sentiment</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '20px' }}>
                            {sentimentAnalysis.map((elem, i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{elem.sentence}</td>
                                    <td style={{ fontSize: '40px' }}>
                                        {/* {elem.sentiment} */}
                                        {elem.sentiment === 0
                                            ? '😀'
                                            : elem.sentiment === 1
                                            ? '😠'
                                            : '😐'}
                                    </td>
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
