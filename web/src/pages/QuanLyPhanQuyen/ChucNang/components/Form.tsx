import { Form, Input, InputNumber, Modal, Select, Switch, TreeSelect } from 'antd';
import { useEffect } from 'react';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import rules from '@/utils/rules';

interface FormProps {
  visible: boolean;
  edit: boolean;
  record?: ChucNang.IRecord;
  phanHeId?: string;
  phanHeList: PhanHe.IRecord[];
  treeData: ChucNang.IRecord[];
  onClose: () => void;
  onSuccess: () => void;
}

const FormChucNang = (props: FormProps) => {
  const [form] = Form.useForm();
  const { visible, edit, record, phanHeId, phanHeList, treeData, onClose, onSuccess } = props;

  useEffect(() => {
    if (!visible) form.resetFields();
    else if (record?.id) form.setFieldsValue(record);
    else form.setFieldsValue({ phanHeId, thuTu: 0, trangThai: true });
  }, [record?.id, visible, phanHeId]);

  const onFinish = async (values: any) => {
    try {
      if (edit && record?.id) {
        await axios.put(`${ip3}/chuc-nang/${record.id}`, values);
      } else {
        await axios.post(`${ip3}/chuc-nang`, values);
      }
      onClose();
      onSuccess();
    } catch {}
  };

  const treeSelectData = (nodes: ChucNang.IRecord[], excludeId?: string): any[] => {
    return nodes
      .filter((n) => n.id !== excludeId)
      .map((n) => ({
        title: `${n.ma} — ${n.ten}`,
        value: n.id,
        children: n.children?.length ? treeSelectData(n.children, excludeId) : undefined,
      }));
  };

  return (
    <Modal title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'chức năng'} open={visible}
      onCancel={onClose} onOk={() => form.submit()} width={600} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="phanHeId" label="Phân hệ" rules={[...rules.required]}>
          <Select options={phanHeList.map((p) => ({ label: `${p.ma} — ${p.ten}`, value: p.id }))} />
        </Form.Item>
        <Form.Item name="ma" label="Mã chức năng" rules={[...rules.required, ...rules.length(200)]}>
          <Input placeholder="VD: thinghiem|xem" />
        </Form.Item>
        <Form.Item name="ten" label="Tên chức năng" rules={[...rules.required, ...rules.length(255)]}>
          <Input placeholder="Tên chức năng" />
        </Form.Item>
        <Form.Item name="parentId" label="Chức năng cha">
          <TreeSelect allowClear placeholder="Để trống nếu là gốc"
            treeData={treeSelectData(treeData, record?.id)} />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="thuTu" label="Thứ tự" initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="trangThai" label="Trạng thái" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormChucNang;
