// src/services/api.js

// Futura Configuração Supabase
// const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
// const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

export const fetchHubData = async () => {
  // Simulando latência de rede (ex: 800ms)
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Utilizando o LocalStorage atual apenas como Mock do "Banco de Dados"
  const saved = localStorage.getItem("servlink_db_mock");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Falha ao parsear o DB Mock", e);
    }
  }
  return null;
};

export const updateHubData = async (payload) => {
  // Simulando latência de gravação de payload
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Escrita Mock no "Banco de Dados"
    localStorage.setItem("servlink_db_mock", JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error("Falha ao enviar pro Backend", error);
    return { success: false, error };
  }
};
