import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<VaiTro.IRecord>('vai-tro');

  return {
    ...objInit,
  };
};
