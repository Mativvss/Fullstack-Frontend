import { useState, useEffect, useCallback } from 'react';

export function useCarga(funcion) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    try {
      setDatos(await funcion());
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [funcion]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { datos, error, cargando, recargar: cargar };
}
