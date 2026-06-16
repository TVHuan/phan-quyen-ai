import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const FormVaiTro = () => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('quanlyphanquyen.vaitro');
  const [phanHeList, setPhanHeList] = useState<PhanHe.IRecord[]>([]);

  useEffect(() => {
    axios.get(`${ip3}/phan-he/all`).then((res) => setPhanHeList(res.data?.data ?? []));
  }, []);

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?.id) form.setFieldsValue(record);
  }, [record?.id, visibleForm]);

  const onFinish = (values: any) => {
    if (edit) {
      putModel(record?.id ?? '', values).catch((er) => console.log(er));
    } else {
      postModel(values).then(() => form.resetFields()).catch((er) => console.log(er));
    }
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'vai trò'}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item name="phanHeId" label="Phân hệ" rules={[...rules.required]}>
          <Select
            placeholder="Chọn phân hệ"
            options={phanHeList.map((p) => ({ label: `${p.ma} - ${p.ten}`, value: p.id }))}
          />
        </Form.Item>
        <Form.Item name="ma" label="Mã vai trò" rules={[...rules.required, ...rules.length(100)]}>
          <Input placeholder="VD: admin, giao-vien, hoc-sinh" />
        </Form.Item>
        <Form.Item name="ten" label="Tên vai trò" rules={[...rules.required, ...rules.length(255)]}>
          <Input placeholder="Tên vai trò" />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả vai trò" />
        </Form.Item>
        <Form.Item name="macDinh" label="Mặc định" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item name="trangThai" label="Trạng thái" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="On" unCheckedChildren="Off" />
        </Form.Item>
        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormVaiTro;
