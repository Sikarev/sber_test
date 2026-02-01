const API_BASE_URL = 'http://localhost:3001';

export interface SelectOption {
  name: string;
  value: string;
}

export interface SelectedOptionResponse {
  message: string;
}

export const api = {
  async getSelectOptions(): Promise<SelectOption[]> {
    const response = await fetch(`${API_BASE_URL}/options/for/select`);
    if (!response.ok) {
      throw new Error('Ошибка загрузки опций');
    }
    return response.json();
  },

  async postSelectedOption(value: string): Promise<SelectedOptionResponse> {
    const response = await fetch(`${API_BASE_URL}/selected/option`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      throw new Error('Ошибка отправки опции');
    }
    return response.json();
  },
};
