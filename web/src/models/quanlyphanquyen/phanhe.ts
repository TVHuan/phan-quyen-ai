import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<PhanHe.IRecord>('phan-he');

  return {
    ...objInit,
  };
};
