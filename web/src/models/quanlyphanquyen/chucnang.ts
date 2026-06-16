import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<any>();
  const [edit, setEdit] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);

  return { record, setRecord, edit, setEdit, visibleForm, setVisibleForm };
};
