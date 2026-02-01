import React, { useState, useEffect } from 'react';
import { UIButton, UIMessage, UISelect } from './components';
import { api, SelectOption } from './api';

type Position = 'top' | 'center' | 'bottom';

const App: React.FC = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<Position>('center');

  const displayMessage = isLoading ? 'Загрузка...' : message;

  const handleSubmit = async () => {
    if (!selectedValue) return;

    try {
      setIsLoading(true);
      const response = await api.postSelectedOption(selectedValue);
      setMessage(response.message);
    } catch (err) {
      setMessage('Ошибка при отправке данных на сервер');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoading(true);
        const data = await api.getSelectOptions();
        setOptions(data);
      } catch (err) {
        setMessage('Ошибка загрузки опций с сервера');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOptions();
  }, []);

  const alignItems = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end'
  };

  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: alignItems[position], 
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* position control */}
      <div style={{ position: 'fixed', top: 10, right: 10, display: 'flex', gap: '4px' }}>
        {(['top', 'center', 'bottom'] as Position[]).map(p => (
          <button 
            key={p} 
            onClick={() => setPosition(p)}
            style={{ 
              padding: '4px 8px',
              background: position === p ? '#0066cc' : '#f0f0f0',
              color: position === p ? '#fff' : '#000',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <UISelect 
            options={options} 
            value={selectedValue}
            onChange={setSelectedValue}
          />
          <UIButton disabled={!selectedValue || isLoading} onClick={handleSubmit}>Отправить</UIButton>
        </div>
        <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
          <UIMessage message={displayMessage} />
        </div>
      </div>
    </div>
  );
};

export default App;
