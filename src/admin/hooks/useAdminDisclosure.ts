import { useState } from 'react';

export function useAdminDisclosure<T extends string = string>() {
  const [openId, setOpenId] = useState<T | null>(null);

  const toggle = (id: T) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const close = () => setOpenId(null);

  return {
    openId,
    toggle,
    close,
  };
}
