import { useEffect, useRef } from 'react';

// ==============================|| HOOKS - FORMS REFERENCE  ||============================== //

const useScriptRef = () => {
  const scripted = useRef(true);

  useEffect(
    () => () => {
      scripted.current = false;
    },
    []
  );

  return scripted;
};

export default useScriptRef;
