import React, { useState, useEffect } from 'react';

const CURRENCY_LIST = [
  'USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'SGD', 'CNY', 'KRW', 'AED', 'BRL', 'ZAR', 'CHF', 'HKD'
];

const CurrencyConverterPage = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setResult(null);
    setError('');
  }, [from, to, amount]);

  const convert = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/currency/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, amount })
      });
      const data = await res.json();
      if (data.result !== undefined) {
        setResult(data.result);
      } else {
        setError('Conversion failed.');
      }
    } catch (err) {
      setError('Error fetching conversion rate.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Currency Converter</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border rounded px-3 py-2 w-1/2 focus:outline-blue-500"
            placeholder="Amount"
          />
          <select value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-3 py-2 w-1/4">
            {CURRENCY_LIST.map(cur => <option key={cur} value={cur}>{cur}</option>)}
          </select>
          <span className="mx-2 text-gray-500">→</span>
          <select value={to} onChange={e => setTo(e.target.value)} className="border rounded px-3 py-2 w-1/4">
            {CURRENCY_LIST.map(cur => <option key={cur} value={cur}>{cur}</option>)}
          </select>
        </div>
        <button
          onClick={convert}
          disabled={loading || !amount}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        {result !== null && (
          <div className="text-center mt-4 text-xl font-semibold text-green-600">
            {amount} {from} = {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </div>
        )}
        {error && <div className="text-center text-red-500 mt-2">{error}</div>}
      </div>
      <div className="mt-6 text-xs text-gray-400 text-center">Powered by exchangerate.host</div>
    </div>
  );
};

export default CurrencyConverterPage;
